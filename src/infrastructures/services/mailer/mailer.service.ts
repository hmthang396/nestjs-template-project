import { NotificationSender } from '@domains/services/notification.service';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService implements NotificationSender<ISendMailOptions> {
  constructor(private mailerService: MailerService) {}

  // getOtpEmailSubject(otpType: OtpUseCase): string {
  //   switch (otpType) {
  //     case OtpUseCase.Register:
  //       return 'Please use this OTP to verify your account';
  //     // Add more cases as needed for different OTP use cases
  //     default:
  //       return '';
  //   }
  // }

  // buildOtpEmailConfig(email: string, recipientName: string, otp: Otp, otpLifetime: any) {
  //   const subject = this.getOtpEmailSubject(otp.type);
  //   const context = this.buildOtpEmailContext(recipientName, otp.code, otpLifetime, subject);
  //   return {
  //     to: email,
  //     subject: 'Thank to use our app! This is your otp',
  //     template: './sendotp',
  //     context,
  //   };
  // }

  // buildUserConfirmationEmailConfig(email: string, recipientName: string, confirmationToken: string) {
  //   const confirmationUrl = this.getUserConfirmationUrl(confirmationToken);

  //   return {
  //     to: email,
  //     subject: 'Welcome to Our App! Please confirm your Email',
  //     template: './confirmation',
  //     context: {
  //       name: recipientName,
  //       url: confirmationUrl,
  //     },
  //   };
  // }

  async sendNotification(option: ISendMailOptions) {
    await this.mailerService.sendMail(option);
    return;
  }

  // private buildOtpEmailContext(name: string, otpCode: string, lifetime: any, title: string) {
  //   return {
  //     title,
  //     name,
  //     otp: otpCode,
  //     lifetime,
  //   };
  // }

  // private getUserConfirmationUrl(token: string): string {
  //   return `${this.mailerConfig.getResetPasswordLink()}?token=${token}`;
  // }
}
