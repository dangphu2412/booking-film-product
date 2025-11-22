import { CreateInAppNotificationDTO } from '../use-case/create-in-app-notification.dto';

export const InAppNotificationService = Symbol.for('InAppNotificationService');
export interface InAppNotificationService {
  create(createInAppNotificationDTO: CreateInAppNotificationDTO): Promise<void>;
}
