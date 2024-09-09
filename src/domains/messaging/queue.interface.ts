import { RequestOptions } from '@golevelup/nestjs-rabbitmq';

export interface QueueResponse<T = any> {
  transactionId: string;
  content: T;
}

export interface QueueRequest<T = any> {
  transactionId: string;
  exchange: string;
  routingKey: string;
  content: T;
}

export interface QueueRequestWithOptions extends QueueRequest {
  options?: RequestOptions;
}
