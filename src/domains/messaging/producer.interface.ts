import { QueueRequestWithOptions } from './queue.interface';

export interface IProducerService {
  publishToExchange(request: QueueRequestWithOptions);
}
