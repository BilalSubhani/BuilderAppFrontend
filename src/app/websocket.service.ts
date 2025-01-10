import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;
  private isConnected = false;

  constructor(private zone: NgZone) {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 20000
    });

    this.socket.on('connect', () => {
      this.zone.run(() => console.log('WebSocket connected inside Angular Zone'));
      // this.isConnected = true;
        // this.connectionStatus.next(true);
        // resolve();
    });

    this.socket.on('connect_error', (err) => {
      this.zone.run(() => console.error('Connection error:', err));
      // this.connectionStatus.next(false);
        // reject(error);
    });

    this.socket.on('disconnect', (reason) => {
      this.zone.run(() => console.warn('Disconnected:', reason));
    });
  }


  sendMessage(comp: any): void {
    if (!this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('changeDetected', comp);
    console.log('Sent data to server:', comp);
  }

  receiveMessages(): void {
    if (!this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.on('handleChange', (data) => {
      console.log('Data received from server:', data);
    });

    this.socket.on('error', (errorMessage) => {
      console.error('Error from server:', errorMessage);
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
