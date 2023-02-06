import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ClientProxySuperFlights } from '../common/proxy/client-proxy';
import { Observable } from 'rxjs';
import { IPassenger } from 'src/common/interfaces/passenger.interface';
import { PassengerDTO } from './dto/passenger.dto';
import { PassengerMSG } from '../common/constants';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';

@ApiTags('passengers')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/passenger')
export class PassengerController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) { }

  private _clientProxyPassenger = this.clientProxy.clientProxyPassengers();

  @Post()
  create(@Body() passengerDTO: PassengerDTO): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.CREATE, passengerDTO);
  }

  @Get()
  findAll() {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IPassenger> {
    return this._clientProxyPassenger.send(PassengerMSG.FIND_ONE, id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() passengerDTO: PassengerDTO) {
    return this._clientProxyPassenger.send(PassengerMSG.UPDATE, {
      id,
      passengerDTO,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyPassenger.send(PassengerMSG.DELETE, id);
  }
}
