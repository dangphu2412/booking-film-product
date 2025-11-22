import { InAppNotificationRepositoryInterface } from '../domain/in-app-notification-repository.interface';
import { Injectable } from '@nestjs/common';
import { NotificationAggregate } from '../domain/in-app-notification.aggregate';

@Injectable()
export class InAppNotificationRepositoryImpl
  implements InAppNotificationRepositoryInterface
{
  createMany(notificationAggregate: NotificationAggregate[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
}