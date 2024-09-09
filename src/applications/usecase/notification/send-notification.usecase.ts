import { Notification } from '@domains/entities';
import { IProducerService } from '@domains/messaging/producer.interface';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';

export class SendNotificationUseCase implements UseCase<void, void> {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly producerService: IProducerService,
  ) {}

  async execute(): Promise<void> {
    const notifications = await this.unitOfWork.getNotificationRepository().findAllQueuingNotifications();

    notifications.forEach((notification) => this.triggerProducer(notification));
  }

  private triggerProducer(notification: Notification) {
    this.producerService.publishToExchange({
      transactionId: notification.transactionId,
      routingKey: notification.routingKey,
      content: notification.content,
      exchange: notification.exchange,
    });
  }
}
