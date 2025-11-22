import { NotificationAggregate } from './in-app-notification.aggregate';

export const InAppNotificationRepositoryInterface = Symbol.for(
  'InAppNotificationRepository',
);
export interface InAppNotificationRepository {
  createMany(notificationAggregate: NotificationAggregate[]): Promise<void>;
}
