import { InAppNotificationService } from '../domain/in-app-notification-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { CreateInAppNotificationDTO } from './create-in-app-notification.dto';
import { InAppNotificationRepositoryInterface } from '../domain/in-app-notification-repository.interface';
import { NotificationAggregate } from '../domain/in-app-notification.aggregate';

@Injectable()
export class InAppNotificationServiceImpl implements InAppNotificationService {
  constructor(
    @Inject(InAppNotificationRepositoryInterface)
    private readonly inAppNotificationRepository: InAppNotificationRepositoryInterface,
  ) {}

  create(
    createInAppNotificationDTO: CreateInAppNotificationDTO,
  ): Promise<void> {
    const notificationAggregates = createInAppNotificationDTO.to.map(
      (targetEmail) => {
        return NotificationAggregate.create(
          targetEmail,
          createInAppNotificationDTO.eventType,
          createInAppNotificationDTO.title,
          createInAppNotificationDTO.body,
          createInAppNotificationDTO.actionLink,
          createInAppNotificationDTO.metadata,
        );
      },
    );

    return this.inAppNotificationRepository.createMany(notificationAggregates);
  }
}
