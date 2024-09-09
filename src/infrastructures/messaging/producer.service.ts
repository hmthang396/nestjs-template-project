import { IProducerService } from '@domains/messaging/producer.interface';
import { QueueRequestWithOptions } from '@domains/messaging/queue.interface';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducerService implements IProducerService {
  constructor(private readonly connection: AmqpConnection) {}

  publishToExchange(request: QueueRequestWithOptions) {
    const { routingKey, exchange, transactionId, content, options } = request;

    this.connection.publish(exchange, routingKey, { transactionId, content }, { ...options });
  }
}
