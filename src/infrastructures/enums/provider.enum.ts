export enum UsecasesProxyProvide {
  // Authentication
  LoginUsecase = 'LoginUsecase',
  RegisterUseCase = 'RegisterUseCase',
  SendOtpUseCase = 'SendOtpUseCase',
  VerifyOtpUsecase = 'VerifyOtpUsecase',
  ForgotPasswordUseCase = 'ForgotPasswordUseCase',
  ResetPasswordUseCase = 'ResetPasswordUseCase',
  VerifyRecoveryTokenUseCase = 'VerifyRecoveryTokenUseCase',
  LogoutUsecase = 'LogoutUsecase',
  GenerateAccessTokenFromRefreshTokenUseCase = 'GenerateAccessTokenFromRefreshTokenUseCase',
  // Notification
  SendNotificationUseCase = 'SendNotificationUseCase',
  ProcessNotificationUseCase = 'ProcessNotificationUseCase',
  HandleNotificationErrorUsecase = 'HandleNotificationErrorUsecase',
}
