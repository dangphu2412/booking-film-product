import { Module } from '@nestjs/common';
import { InAppNotificationController } from './presentation/in-app-notification.controller';
import { InAppNotificationService } from './domain/in-app-notification-service.interface';
import { InAppNotificationServiceImpl } from './use-case/in-app-notification.service';

@Module({
  controllers: [InAppNotificationController],
  providers: [
    {
      provide: InAppNotificationService,
      useClass: InAppNotificationServiceImpl,
    },
  ],
})
export class InAppNotificationModule {}
