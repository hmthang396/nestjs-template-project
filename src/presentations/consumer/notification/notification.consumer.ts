import { IConsumer } from '@domains/messaging/consumer.interface';
import { QueueRequest, QueueRequestWithOptions } from '@domains/messaging/queue.interface';
import { UseCase } from '@domains/usecase/usecase.interface';
import {
  MessageHandlerErrorBehavior,
  Nack,
  RabbitSubscribe,
  defaultAssertQueueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';
import { Inject, Injectable } from '@nestjs/common';
import {
  DEAD_LETTER_EXCHANGE_EMAIL,
  EMAIL_NOTIFICATION_EXCHANGE,
} from '@shared/common/constants/queues/exchange.constant';
import { DEAD_LETTER_QUEUE_EMAIL, EMAIL_NOTIFICATION_QUEUE } from '@shared/common/constants/queues/queue.constant';
import {
  DEAD_LETTER_ROUTING_KEY_EMAIL,
  ROUTE_KEY_OTP_REGISTRATION,
  ROUTE_KEY_OTP_RESEND,
} from '@shared/common/constants/queues/route-key.constant';
import { SkipAuth } from '@shared/decorators';
import { ReplyErrorCallback } from '@shared/helpers';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class NotificationConsumer implements IConsumer<any, ConsumeMessage> {
  constructor(
    @Inject(UsecasesProxyProvide.ProcessNotificationUseCase)
    private readonly processNotificationUseCase: UseCaseProxy<
      UseCase<{ type: 'email' | 'sms'; payload: QueueRequestWithOptions }, void>
    >,

    @Inject(UsecasesProxyProvide.HandleNotificationErrorUsecase)
    private readonly handleNotificationErrorUsecase: UseCaseProxy<UseCase<string, void>>,
  ) {}

  @RabbitSubscribe({
    exchange: EMAIL_NOTIFICATION_EXCHANGE,
    routingKey: [ROUTE_KEY_OTP_RESEND, ROUTE_KEY_OTP_REGISTRATION],
    queue: EMAIL_NOTIFICATION_QUEUE,
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    errorHandler: ReplyErrorCallback,
    assertQueueErrorHandler: defaultAssertQueueErrorHandler,
    queueOptions: {
      deadLetterExchange: DEAD_LETTER_EXCHANGE_EMAIL,
      deadLetterRoutingKey: DEAD_LETTER_ROUTING_KEY_EMAIL,
    },
  })
  @SkipAuth()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handlerMessage(message: QueueRequest<any>, amqpMsg: ConsumeMessage): Promise<void> {
    try {
      await this.processNotificationUseCase.getInstance().execute({
        type: 'email',
        payload: message,
      });
    } catch (error) {
      throw new Nack(true);
    }
  }

  @RabbitSubscribe({
    exchange: DEAD_LETTER_EXCHANGE_EMAIL,
    routingKey: DEAD_LETTER_ROUTING_KEY_EMAIL,
    queue: DEAD_LETTER_QUEUE_EMAIL,
    queueOptions: {
      autoDelete: false,
    },
  })
  @SkipAuth()
  async handlerFailedMessage(message: QueueRequest<any>): Promise<void> {
    try {
      const { transactionId } = message;
      await this.handleNotificationErrorUsecase.getInstance().execute(transactionId);
      return;
    } catch (error) {
      throw new Nack(true);
    }
  }
}
