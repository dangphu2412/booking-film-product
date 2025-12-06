import { Module } from '@nestjs/common';
import { InAppNotificationController } from './presentation/in-app-notification.controller';
import { InAppNotificationService } from './domain/in-app-notification-service.interface';
import { InAppNotificationServiceImpl } from './use-case/in-app-notification.service';
import { InAppNotificationRepositoryImpl } from './infras/in-app-notification.repository';
import { InAppNotificationRepository } from './domain/in-app-notification-repository.interface';

@Module({
  controllers: [InAppNotificationController],
  providers: [
    {
      provide: InAppNotificationService,
      useClass: InAppNotificationServiceImpl,
    },
    {
      provide: InAppNotificationRepository,
      useClass: InAppNotificationRepositoryImpl,
    },
  ],
})
export class InAppNotificationModule {}
