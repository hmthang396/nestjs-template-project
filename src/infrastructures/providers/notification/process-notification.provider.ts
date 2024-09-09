import { ProcessNotificationUseCase } from '@applications/usecase/notification';
import { NotificationSender } from '@domains/services/notification.service';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { EmailSenderService } from '@infrastructures/services/mailer/mailer.service';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';
import { ISendMailOptions } from '@nestjs-modules/mailer';

export const ProcessNotificationProvider = {
  inject: [UnitOfWork, EmailSenderService],
  provide: UsecasesProxyProvide.ProcessNotificationUseCase,
  useFactory: (unitOfWork: IUnitOfWork, emailSender: NotificationSender<ISendMailOptions>) =>
    new UseCaseProxy(new ProcessNotificationUseCase(unitOfWork, emailSender)),
};
