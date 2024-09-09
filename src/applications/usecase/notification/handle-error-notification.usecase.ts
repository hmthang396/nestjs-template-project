import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { UseCase } from '@domains/usecase/usecase.interface';

export class HandleNotificationErrorUsecase implements UseCase<string, void> {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(input: string): Promise<void> {
    await this.unitOfWork.getNotificationRepository().markAsError(input);
    return;
  }
}
