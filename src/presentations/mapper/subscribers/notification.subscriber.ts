import { UseCase } from '@domains/usecase/usecase.interface';
import { NotificationEntity } from '@infrastructures/entities/notification.entity';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';
import { Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class NotificationSubscriber implements EntitySubscriberInterface<NotificationEntity> {
  constructor(
    @InjectConnection()
    readonly connection: Connection,
    @Inject(UsecasesProxyProvide.SendNotificationUseCase)
    private readonly sendNotificationUseCase: UseCaseProxy<UseCase<void, void>>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return NotificationEntity;
  }

  async afterTransactionCommit() {
    await this.sendNotificationUseCase.getInstance().execute();
  }
}
