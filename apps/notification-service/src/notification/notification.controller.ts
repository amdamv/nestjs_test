import { NotificationGateway } from './notification.gateway';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { console } from 'node:inspector';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @EventPattern('notificationTransaction')
  sendNotification(@Payload() payload: { senderId: string; receiverId: string; amount: number }) {
    console.log(payload);
    const { senderId, receiverId, amount } = payload;
    this.notificationGateway.sendNotification(senderId, `You send ${amount} to user $${receiverId}`);
    this.notificationGateway.sendNotification(receiverId, `You received $${amount} from user ${senderId}`);
  }
}
