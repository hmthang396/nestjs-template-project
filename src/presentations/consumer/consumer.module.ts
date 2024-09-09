import { RabbitMQConfigModule } from '@infrastructures/config/rabbit-mq/rabbit-mq.module';
import { Global, Module } from '@nestjs/common';
import { NotificationConsumer } from './notification/notification.consumer';

@Module({
  imports: [RabbitMQConfigModule],
  providers: [NotificationConsumer],
  exports: [NotificationConsumer],
})
@Global()
export class ConsumerModule {}
