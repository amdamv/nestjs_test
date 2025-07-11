import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { MyLibModule } from '@app/my-lib';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MyLibModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'NatsService',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: configService.get<string>('NATS_SERVERS'),
          },
        }),
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway],
})
export class NotificationModule {}
