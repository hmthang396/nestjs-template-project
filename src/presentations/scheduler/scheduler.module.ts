import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationScheduler } from './notification.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [NotificationScheduler],
  exports: [NotificationScheduler],
})
export class SchedulerModule {}
