import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from './user.service';

@WebSocketGateway({ cors: true })
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('UserGateway');

  @SubscribeMessage('setLike')
  async handleMessage(client: Socket, payload) {
    const user = await this.userService.toggleLike(
      payload.myUsername,
      payload.targetUsername,
    );
    this.server.emit('setLikeNotification', {
      targetUser: user,
      whoSetLike: payload.myUsername,
    });
  }

  @SubscribeMessage('setStatusOnline')
  async setStatusOnline(client: Socket, payload) {    
    await this.userService.setStatusOnline({ ...payload, socketId: client.id});
    this.server.emit('userStatus', {
      username: payload.username,
      status: true,
    });
  }

  async handleDisconnect(client: Socket) {
    const newUserStatus = await this.userService.setStatusOffline({ socketId: client.id});
    this.server.emit('userStatus', newUserStatus)
    this.logger.log(`Client disconnected: ${client.id}, ${newUserStatus.username}`);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
