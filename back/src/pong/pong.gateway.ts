import {
  MessageBody,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'socket.io'
import { PongService } from './pong.service';

@WebSocketGateway(8001, {cors: '*'})
export class PongGateway
implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly pongService: PongService) {}
  private pingInterval: NodeJS.Timeout;

  

  async handleConnection( client: Socket)
  {
    // this.server.emit('ping', { data: "connected to serv" });
    console.log(`User ${client.id} Connected ༼ つ ◕_◕ ༽つ`)
    
    this.pingInterval = setInterval(() => {
      client.emit('ping', 'PING');
    }, 1000);
  
    client.on('disconnect', () => {
      clearInterval(this.pingInterval);
    });
  
    client.on('updateTimer', (newInterval) => {
      clearInterval(this.pingInterval);
      this.pingInterval = setInterval(() => {
        client.emit('ping', 'PING');
      }, newInterval);
    });
  }


  
  handleDisconnect(client: Socket)
  {
    console.log(`User ${client.id} Disconnected (◞ ‸ ◟ ；)`)
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log(message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('pong')
  handlePong(@MessageBody() data: string): void {
    console.log(data);
    // this.server.emit('ping', data);
  }

  @SubscribeMessage('getClient1')
  handleGetClient1(client: any) {
    const client1 = this.pongService.getClient1();
    client.emit('client1', client1);
  }

  @SubscribeMessage('updateClient1')
  handleUpdateClient1(client: any, newValue: number) {
    this.pongService.updateClient1(newValue);
    this.server.emit('client1Updated', newValue);
  }

  // @SubscribeMessage('racketMovement')
  // handleRacketMovement(@MessageBody() percent: number): void {
  //   this.server.emit('racketMoved', percent);
  // }

  // @SubscribeMessage('packet')
  // handlePacket(packet: any) {
  //   this.pongService.updateClient1(newValue);
  //   this.server.emit('client1Updated', newValue);
  // }
}
