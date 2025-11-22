import { InAppNotificationService } from '../domain/in-app-notification-service.interface';
import { Injectable } from '@nestjs/common';
import { CreateInAppNotificationDTO } from './create-in-app-notification.dto';

@Injectable()
export class InAppNotificationServiceImpl implements InAppNotificationService {
  create(
    createInAppNotificationDTO: CreateInAppNotificationDTO,
  ): Promise<void> {
    console.log('InAppNotificationService create', createInAppNotificationDTO);

    return Promise.resolve();
  }
}
