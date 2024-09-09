import { MessageErrorHandler, Nack } from '@golevelup/nestjs-rabbitmq';
import { Channel, ConsumeMessage } from 'amqplib';

const maxRetries: number = 3;

/* eslint-disable @typescript-eslint/no-unused-vars */
export const ReplyErrorCallback: MessageErrorHandler = (channel: Channel, msg: ConsumeMessage, error: Nack) => {
  const retries: number = msg.fields.deliveryTag;
  const redelivered: boolean = msg.fields.redelivered;

  if (retries < maxRetries || !redelivered) {
    // Retry Message
    channel.nack(msg, false, true);
  } else {
    channel.reject(msg, false);
  }
};
