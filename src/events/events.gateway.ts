import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('EventsGateway');

  sendAttackMessage(message: EventsGateway.AttackMessage) {
    this.server.emit('attack', message);
  }

  sendMessageForMap(message: EventsGateway.MessageForMap) {
    this.server.emit('map', message)
  }

  sendInfoMessage(message: Object) {
    this.server.emit('info', message);
  }

  afterInit(server: Server) {
    this.logger.log(`Initialized ${server.local}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleNewHexagonOnMap(message: EventsGateway.NewHexagonMessage) {
    this.server.emit('newHexagon', message);
  }
}

export namespace EventsGateway {
  export interface AttackMessage {
    to: string;
    type: 'warning' | 'info' | 'success' | 'error';
    message: string;
  }

  export interface MessageForMap {
    from: number;
    to: number;
    attack: 'started' | 'ended';
  }

  export interface NewHexagonMessage {
    numericId: number;
    username: string;
  }
}
