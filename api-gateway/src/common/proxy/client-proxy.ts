import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ClientProxyFactory } from '@nestjs/microservices/client';
import { Transport } from '@nestjs/microservices/enums';
import { RabbitMQ } from '../constants';

@Injectable()
export class ClientProxySuperFlights {
  constructor(private readonly config: ConfigService) {}

  clientProxyUsers(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.UserQueue,
      },
    });
  }

  clientProxyPassengers(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.PassengerQueue,
      },
    });
  }

  clientProxyFlights(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.FlightsQueue,
      },
    });
  }
}
