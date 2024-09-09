import { SendNotificationUseCase } from '@applications/usecase/notification/send-notification.usecase';
import { IProducerService } from '@domains/messaging/producer.interface';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { ProducerService } from '@infrastructures/messaging/producer.service';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const SendNotificationProvider = {
  inject: [UnitOfWork, ProducerService],
  provide: UsecasesProxyProvide.SendNotificationUseCase,
  useFactory: (unitOfWork: IUnitOfWork, producerService: IProducerService) =>
    new UseCaseProxy(new SendNotificationUseCase(unitOfWork, producerService)),
};
