import { InAppNotificationRepository } from '../domain/in-app-notification-repository.interface';
import { Injectable } from '@nestjs/common';
import { NotificationAggregate } from '../domain/in-app-notification.aggregate';

@Injectable()
export class InAppNotificationRepositoryImpl
  implements InAppNotificationRepository
{
  createMany(notificationAggregate: NotificationAggregate[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}