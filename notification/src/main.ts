import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const brokers = configService
    .get<string>('KAFKA_BROKERS', 'localhost:19092,localhost:19093')
    .split(',');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:5001',
      package: 'proto.notification.mail.v1',
      protoPath: 'proto/notification/mail/v1/mail.proto',
      loader: {
        includeDirs: [
          join(process.cwd(), 'node_modules/@dnp2412/shipping-protos'),
        ],
        arrays: true,
        objects: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification',
        brokers,
      },
      consumer: {
        groupId: 'notification-group',
      },
      producer: {
        retry: {
          retries: 2,
          initialRetryTime: 300,
        },
      },
    },
  });
  const logger = app.get(Logger);

  app.useLogger(logger);

  await app.init();
  await app.startAllMicroservices();

  logger.log('App listening on port GRPC 5001');
}

bootstrap();
