import { RabbitMQConfigModule } from '@infrastructures/config/rabbit-mq/rabbit-mq.module';
import { Global, Module } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Module({
  imports: [RabbitMQConfigModule],
  providers: [ProducerService],
  exports: [ProducerService],
})
@Global()
export class RabbitModule {}
