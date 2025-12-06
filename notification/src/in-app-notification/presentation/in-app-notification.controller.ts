import { EventPattern, Payload } from '@nestjs/microservices';
import {
  CREATE_IN_APP_NOTIFICATION_EVENT,
  CreateInAppNotificationPayload,
} from '../domain/create-in-app-notification.event';
import { InAppNotificationService } from '../domain/in-app-notification-service.interface';
import { Controller, Inject } from '@nestjs/common';

@Controller()
export class InAppNotificationController {
  constructor(
    @Inject(InAppNotificationService)
    private readonly inAppNotificationService: InAppNotificationService,
  ) {}

  // @EventPattern(CREATE_IN_APP_NOTIFICATION_EVENT)
  // handleCreateInAppNotificationPayload(
  //   @Payload() payload: CreateInAppNotificationPayload,
  // ) {
  //   return this.inAppNotificationService.create(payload);
  // }
}
