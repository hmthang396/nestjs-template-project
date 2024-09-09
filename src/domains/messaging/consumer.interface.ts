import { QueueRequest } from './queue.interface';

export interface IConsumer<T, U> {
  handlerMessage(message: QueueRequest<T>, amqpMsg: U): Promise<void>;

  handlerFailedMessage(message: QueueRequest<T>): Promise<void>;
}
