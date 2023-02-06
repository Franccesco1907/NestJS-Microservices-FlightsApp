import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FLIGHT, PASSENGER } from '../common/models/models';
import { FlightSchema } from './schema/flight.schema';
import { PassengerSchema } from './schema/passenger.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: FLIGHT.name,
        useFactory: () => FlightSchema.plugin(require('mongoose-autopopulate')), 
        // to return not only id's of passenger. We can return all the passenger info
      },
      {
        name: PASSENGER.name,
        useFactory: () => PassengerSchema,
      },
    ]),
  ],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
