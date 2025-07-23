import { NotificationGateway } from './notification.gateway';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('notification')
export class NotificationController {
  logger = new Logger(NotificationController.name);

  constructor(private readonly notificationGateway: NotificationGateway) {}

  @EventPattern('notificationTransaction')
  sendNotification(@Payload() payload: { senderId: string; receiverId: string; amount: number }) {
    this.logger.log('notification payload: ', payload);
    const { senderId, receiverId, amount } = payload;
    this.notificationGateway.sendNotification(senderId, `You send $${amount} to user ${receiverId}`);
    this.notificationGateway.sendNotification(receiverId, `You received $${amount} from user ${senderId}`);
  }
}
