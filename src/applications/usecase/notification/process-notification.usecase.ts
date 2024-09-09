import { QueueRequestWithOptions } from '@domains/messaging/queue.interface';
import { NotificationSender } from '@domains/services/notification.service';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { IsolationLevel } from '@shared/common/enums';
import { Transactional } from '@shared/decorators';

export class ProcessNotificationUseCase
  implements UseCase<{ type: 'email' | 'sms'; payload: QueueRequestWithOptions }, void>
{
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly emailSender: NotificationSender<ISendMailOptions>,
  ) {}

  @Transactional({
    replication: true,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async execute(input: { type: 'email' | 'sms'; payload: QueueRequestWithOptions }): Promise<void> {
    const { payload, type } = input;

    const { transactionId, content } = payload;

    // Get transaction outbox
    const outbox = await this.unitOfWork.getNotificationRepository().findOneByTransactionId(transactionId);

    // The MQ is sent to queue
    await this.unitOfWork.getNotificationRepository().markAsSent(transactionId);

    // If the outbox is being handled, end this consumer, else mark it as handled
    if (outbox.isHandled) return;

    switch (type) {
      case 'email':
        await Promise.all([
          this.emailSender.sendNotification(JSON.parse(content as string)),
          this.unitOfWork.getNotificationRepository().markAsHandled(transactionId),
        ]);
        break;
      case 'sms':
        break;
      default:
        break;
    }
    return;
  }
}
