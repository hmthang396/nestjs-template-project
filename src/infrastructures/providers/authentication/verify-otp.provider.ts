import { VerifyOtpUseCases } from '@applications/usecase/authentication/verify-otp.usecase';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const VerifyOtpProvider = {
  inject: [UnitOfWork],
  provide: UsecasesProxyProvide.VerifyOtpUsecase,
  useFactory: (unitOfWork: UnitOfWork) => new UseCaseProxy(new VerifyOtpUseCases(unitOfWork)),
};
