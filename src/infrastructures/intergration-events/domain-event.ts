import { Notification } from '@domains/entities';
import { EMAIL_NOTIFICATION_EXCHANGE } from '@shared/common/constants/queues/exchange.constant';
import { ROUTE_KEY_OTP_RESEND } from '@shared/common/constants/queues/route-key.constant';
class OTPAfterRegistration {
  private to: string;
  private subject: string;
  private template: string;
  private context: Record<string, any>;

  constructor(recipient: string, subject: string, template: string, context: Record<string, any>) {
    this.context = context;
    this.to = recipient;
    this.subject = subject;
    this.template = template;
  }

  // Converts the data into a Notification object
  toNotification() {
    const notification = new Notification();
    notification.content = JSON.stringify(this);
    notification.exchange = EMAIL_NOTIFICATION_EXCHANGE;
    notification.routingKey = ROUTE_KEY_OTP_RESEND;
    return notification;
  }
}

class OTPAfterRegistrationBuilder {
  private recipient: string;
  private subject: string;
  private template: string;
  private context: Record<string, any>;

  constructor() {}

  setRecipient(email: string) {
    this.recipient = email;
    return this;
  }

  setSubject(subject: string) {
    this.subject = subject;
    return this;
  }

  setTemplate(template: string) {
    this.template = template;
    return this;
  }

  setContext(context: { title: string; name: string; otp: string; lifetime: number }) {
    this.context = context;
    return this;
  }

  build(): OTPAfterRegistration {
    if (!this.recipient || !this.subject || !this.template || !this.context) {
      throw new Error('Missing required fields to build OTPAfterRegistration');
    }

    return new OTPAfterRegistration(this.recipient, this.subject, this.template, this.context);
  }
}
export class EmailNotification {
  static OTPAfterRegistrationBuilder = OTPAfterRegistrationBuilder;
}

export class DomainEvent {
  static EmailNotification = EmailNotification;

  static SmsNotification = {};

  static PushNotification = {};
}
