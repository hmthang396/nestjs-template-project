import { HandleNotificationErrorUsecase } from '@applications/usecase/notification/handle-error-notification.usecase';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const HandleNotificationErrorProvider = {
  inject: [UnitOfWork],
  provide: UsecasesProxyProvide.HandleNotificationErrorUsecase,
  useFactory: (uow: UnitOfWork) => new UseCaseProxy(new HandleNotificationErrorUsecase(uow)),
};
