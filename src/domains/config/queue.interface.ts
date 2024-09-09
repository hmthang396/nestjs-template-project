export interface QueueConfig {
  getQueueExchangeTimeout(): number;
  getQueueUsername(): string;
  getQueuePassword(): string;
  getQueueHost(): string;
  getQueuePort(): number;
  getQueueUri(): string;
}
