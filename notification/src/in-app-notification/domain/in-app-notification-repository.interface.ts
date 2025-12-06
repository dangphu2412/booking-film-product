import { NotificationAggregate } from './in-app-notification.aggregate';

export const InAppNotificationRepository = Symbol.for(
  'InAppNotificationRepository',
);
export interface InAppNotificationRepository {
  createMany(notificationAggregate: NotificationAggregate[]): Promise<void>;
}
