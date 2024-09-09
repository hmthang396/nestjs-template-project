import { RepositoriesModule } from '@infrastructures/repositories/repositories.module';
import { Module } from '@nestjs/common';
import { NotificationSubscriber } from './notification.subscriber';

@Module({
  imports: [RepositoriesModule],
  providers: [NotificationSubscriber],
  exports: [NotificationSubscriber],
})
export class SubscriberModule {}
