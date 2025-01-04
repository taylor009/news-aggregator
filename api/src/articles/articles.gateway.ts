import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  path: '/articles',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ArticlesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ArticlesGateway.name);

  @WebSocketServer()
  server: Server;

  private clients: Map<WebSocket, NodeJS.Timeout> = new Map();

  handleConnection(client: WebSocket) {
    // Set up ping interval
    const pingInterval = setInterval(() => {
      if (client.readyState === WebSocket.OPEN) {
        client.ping();
      }
    }, 30000);

    // Store the client and its ping interval
    this.clients.set(client, pingInterval);
    this.logger.log(`Client connected. Total clients: ${this.clients.size}`);

    // Set up event listeners
    client.on('pong', () => {
      // Client responded to ping, connection is alive
      this.logger.debug('Received pong from client');
    });

    client.on('error', (error) => {
      this.logger.error('WebSocket error:', error);
      this.cleanup(client);
    });

    client.on('close', () => {
      this.logger.log('Client connection closed');
      this.cleanup(client);
    });
  }

  handleDisconnect(client: WebSocket) {
    this.cleanup(client);
  }

  private cleanup(client: WebSocket) {
    // Clear the ping interval
    const interval = this.clients.get(client);
    if (interval) {
      clearInterval(interval);
    }

    // Remove the client from our map
    this.clients.delete(client);
    this.logger.log(`Client disconnected. Total clients: ${this.clients.size}`);

    // Ensure the connection is closed
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  }

  broadcastNewArticle(article: any) {
    const message = JSON.stringify(article);
    this.clients.forEach((_, client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (error) {
          this.logger.error('Error sending message to client:', error);
          this.cleanup(client);
        }
      }
    });
  }
}
