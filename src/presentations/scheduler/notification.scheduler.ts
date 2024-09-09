import { UseCase } from '@domains/usecase/usecase.interface';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationScheduler {
  constructor(
    @Inject(UsecasesProxyProvide.SendNotificationUseCase)
    private readonly sendNotificationUseCase: UseCaseProxy<UseCase<void, void>>,
  ) {}

  @Cron('*/1 * * * *') // Runs every 1 minutes
  async handleCron() {
    await this.sendNotificationUseCase.getInstance().execute();
  }
}
