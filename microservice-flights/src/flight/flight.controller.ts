import { Controller, HttpStatus } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightDTO } from './dto/flight.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { MessagePattern } from '@nestjs/microservices';
import { FlightMSG } from 'src/common/constants';
import { Payload } from '@nestjs/microservices/decorators';

@Controller()
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
  ) { }

  @MessagePattern(FlightMSG.CREATE)
  create(@Payload() flightDTO: FlightDTO) {
    return this.flightService.create(flightDTO);
  }

  @MessagePattern(FlightMSG.FIND_ALL)
  findAll() {
    return this.flightService.findAll();
  }

  @MessagePattern(FlightMSG.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.flightService.findOne(id);
  }

  @MessagePattern(FlightMSG.UPDATE)
  update(@Payload() payload) {
    return this.flightService.update(payload.id, payload.flightDTO);
  }

  @MessagePattern(FlightMSG.DELETE)
  delete(@Payload() id: string) {
    return this.flightService.delete(id);
  }

  @MessagePattern(FlightMSG.ADD_PASSENGER)
  addPassenger(@Payload() payload) {
    return this.flightService.addPassenger(payload.flightId, payload.passengerId);
  }
}
