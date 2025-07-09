import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtUtilsService } from '@app/my-lib';

@Injectable()
@WebSocketGateway({ cors: true, namespace: 'notification' })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;
  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private readonly jwtUtilsService: JwtUtilsService) {}

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client id: ${client.id} connected`);
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('authHeader not found');
    }
    const { userId: uid } = this.jwtUtilsService.verifyJwt(authHeader);
    (client.data as { userId: string }).userId = uid;
    await client.join(uid);
  }

  @SubscribeMessage('notifications')
  sendNotification(@ConnectedSocket() client: Socket, @MessageBody() payload: { userId: string }) {
    this.io.to(payload.userId).emit('notification', { data: 'hello' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: string) {
    this.logger.log(`PING from ${client.id}: ${data}`);
    client.emit('pong', `Emit response to: ${data}`);
    return { event: 'pong', data: `Ack response to: ${data}` };
  }

  @SubscribeMessage('notify')
  handleNotify(client: Socket, message: string) {
    client.emit('notification', { message, time: new Date().toISOString() });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('roomJoined', room);
  }

  @SubscribeMessage('sendMessage')
  handlerMessage(client: Socket, data: { room: string; text: string }) {
    this.logger.log(`Message from ${client.id} to ${data.room}: ${data.text}`);
    client.to(data.room).emit('newMessage', data.text);
  }
}
