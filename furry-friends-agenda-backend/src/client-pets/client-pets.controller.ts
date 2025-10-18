import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';
import { ClientPetsService } from './client-pets.service';
import { CreatePetDto } from '../pets/dto/create-pet.dto';
import { UpdatePetDto } from '../pets/dto/update-pet.dto';

@Controller('client/pets')
@UseGuards(JwtClientGuard)
export class ClientPetsController {
  constructor(private readonly clientPetsService: ClientPetsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Body() createPetDto: CreatePetDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetsService.create(createPetDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req: { user: { sub: string } }) {
    return this.clientPetsService.findAllByClient(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetsService.findOneByClient(id, req.user.sub);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePetDto: UpdatePetDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetsService.update(id, updatePetDto, req.user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetsService.remove(id, req.user.sub);
  }
}
