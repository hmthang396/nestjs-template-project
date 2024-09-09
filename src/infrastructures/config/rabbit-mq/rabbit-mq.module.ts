import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { QueueConfig } from '@domains/config/queue.interface';
import { DEAD_LETTER_QUEUE_EMAIL, EMAIL_NOTIFICATION_QUEUE } from '@shared/common/constants/queues/queue.constant';
import {
  DEAD_LETTER_EXCHANGE_EMAIL,
  EMAIL_NOTIFICATION_EXCHANGE,
} from '@shared/common/constants/queues/exchange.constant';
import {
  DEAD_LETTER_ROUTING_KEY_EMAIL,
  ROUTE_KEY_OTP_REGISTRATION,
  ROUTE_KEY_OTP_RESEND,
} from '@shared/common/constants/queues/route-key.constant';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [EnvironmentConfigModule],
      useFactory: async (config: QueueConfig) => ({
        exchanges: [
          {
            name: EMAIL_NOTIFICATION_EXCHANGE,
            type: 'direct',
          },
          {
            name: DEAD_LETTER_EXCHANGE_EMAIL,
            type: 'direct',
          },
        ],
        uri: config.getQueueUri(),
        connectionInitOptions: {
          timeout: config.getQueueExchangeTimeout(),
        },
        enableControllerDiscovery: true,
        queues: [
          {
            name: DEAD_LETTER_QUEUE_EMAIL,
            exchange: DEAD_LETTER_EXCHANGE_EMAIL,
            routingKey: DEAD_LETTER_ROUTING_KEY_EMAIL,
            bindQueueArguments: {
              'x-overflow': 'reject-publish',
            },
          },
          {
            name: EMAIL_NOTIFICATION_QUEUE,
            exchange: EMAIL_NOTIFICATION_EXCHANGE,
            routingKey: [ROUTE_KEY_OTP_RESEND, ROUTE_KEY_OTP_REGISTRATION],
            options: {
              deadLetterExchange: DEAD_LETTER_EXCHANGE_EMAIL,
              deadLetterRoutingKey: DEAD_LETTER_ROUTING_KEY_EMAIL,
            },
            bindQueueArguments: {
              'x-overflow': 'reject-publish',
            },
          },
        ],
      }),
      inject: [EnvironmentConfigService],
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQConfigModule {}
