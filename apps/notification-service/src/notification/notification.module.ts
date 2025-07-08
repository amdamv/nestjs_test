import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { MyLibModule } from '@app/my-lib';

@Module({
  imports: [MyLibModule],
  providers: [NotificationGateway],
})
export class NotificationModule {}
