import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { MyLibModule } from '@app/my-lib';
import { NotificationController } from './notification.controller';

@Module({
  imports: [MyLibModule],
  controllers: [NotificationController],
  providers: [NotificationGateway],
})
export class NotificationModule {}
