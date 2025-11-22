import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  CREATE_IN_APP_NOTIFICATION_EVENT,
  CreateInAppNotificationPayload,
} from '../domain/create-in-app-notification.event';
import { InAppNotificationService } from '../domain/in-app-notification-service.interface';

@Controller()
export class InAppNotificationController {
  constructor(
    private readonly inAppNotificationService: InAppNotificationService,
  ) {}

  @EventPattern(CREATE_IN_APP_NOTIFICATION_EVENT)
  handleCreateInAppNotificationPayload(
    payload: CreateInAppNotificationPayload,
  ) {
    return this.inAppNotificationService.create(payload);
  }
}
