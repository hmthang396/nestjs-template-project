import { DomainEvent } from '@infrastructures/intergration-events/domain-event';
export class EmailNotification {
  // Handles sending OTP notification after registration
  static sendOTPAfterRegistration(email: string, name: string, otpCode: string, lifetime: any) {
    const otpAfterRegistration = new DomainEvent.EmailNotification.OTPAfterRegistrationBuilder()
      .setRecipient(email)
      .setSubject('Thank to use our app! This is your otp')
      .setTemplate('./sendotp')
      .setContext({
        title: 'Please use this OTP to verify your account',
        name,
        otp: otpCode,
        lifetime,
      })
      .build();

    return otpAfterRegistration.toNotification();
  }
}

// static resendOTP(content: Record<string, any>) {
//   const notification = new Notification();
//   notification.content = JSON.stringify(content);
//   notification.exchange = EMAIL_NOTIFICATION_EXCHANGE;
//   notification.routingKey = ROUTE_KEY_OTP_RESEND;
//   return notification;
// }
