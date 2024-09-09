import { EnvironmentConfigModule } from '@infrastructures/config/environment-config/environment-config.module';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { LoggerModule } from '@infrastructures/logging/logger.module';
import { RabbitModule } from '@infrastructures/messaging/rabbitmq.module';
import {
  ForgotPasswordProvider,
  GenerateAccessTokenFromRefreshTokenProvider,
  LoginProvider,
  LogoutProvider,
  RegisterProvider,
  ResetPasswordProvider,
  SendOtpProvider,
  VerifyOtpProvider,
  VerifyRecoveryTokenProvider,
} from '@infrastructures/providers/authentication';
import { HandleNotificationErrorProvider, SendNotificationProvider } from '@infrastructures/providers/notification';
import { ProcessNotificationProvider } from '@infrastructures/providers/notification/process-notification.provider';
import { RepositoriesModule } from '@infrastructures/repositories/repositories.module';
import { EmailSenderModule } from '@infrastructures/services/mailer/mailer.module';
import { UnitOfWorkModule } from '@infrastructures/unit-of-work/unit-of-work.module';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    UnitOfWorkModule,
    RabbitModule,
    EmailSenderModule.register(),
  ],
})
@Global()
export class UsecasesProxyModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: UsecasesProxyModule,
      providers: [
        // authentication
        LoginProvider,
        RegisterProvider,
        ForgotPasswordProvider,
        ResetPasswordProvider,
        VerifyRecoveryTokenProvider,
        LogoutProvider,
        GenerateAccessTokenFromRefreshTokenProvider,
        SendOtpProvider,
        VerifyOtpProvider,
        //
        SendNotificationProvider,
        ProcessNotificationProvider,
        HandleNotificationErrorProvider,
      ],
      exports: [
        // authentication
        UsecasesProxyProvide.LoginUsecase,
        UsecasesProxyProvide.RegisterUseCase,
        UsecasesProxyProvide.ForgotPasswordUseCase,
        UsecasesProxyProvide.ResetPasswordUseCase,
        UsecasesProxyProvide.VerifyRecoveryTokenUseCase,
        UsecasesProxyProvide.LogoutUsecase,
        UsecasesProxyProvide.GenerateAccessTokenFromRefreshTokenUseCase,
        UsecasesProxyProvide.SendOtpUseCase,
        UsecasesProxyProvide.VerifyOtpUsecase,
        // notification
        UsecasesProxyProvide.SendNotificationUseCase,
        UsecasesProxyProvide.ProcessNotificationUseCase,
        UsecasesProxyProvide.HandleNotificationErrorUsecase,
      ],
    };
  }
}
