import { NotificationGateway } from './notification.gateway';
import { Controller, Post } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @Post('sendNotification')
  sendNotification(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: string }) {
    return this.notificationGateway.sendNotification(client, payload);
  }
}
