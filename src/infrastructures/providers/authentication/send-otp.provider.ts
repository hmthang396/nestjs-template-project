import { SendOtpUseCases } from '@applications/usecase/authentication/send-otp.usecase';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const SendOtpProvider = {
  inject: [UnitOfWork],
  provide: UsecasesProxyProvide.SendOtpUseCase,
  useFactory: (unitOfWork: UnitOfWork) => new UseCaseProxy(new SendOtpUseCases(unitOfWork)),
};
