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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
// import { Pet } from '@prisma/client'; // O tipo Pet não será reconhecido até o prisma generate

@UseGuards(JwtAuthGuard) // Aplicar JwtAuthGuard a todas as rotas deste controller
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createPetDto: CreatePetDto, @GetUser() user: JwtPayload) {
    return this.petsService.create(createPetDto, user);
  }

  @Get()
  findAll(@GetUser() user: JwtPayload) {
    return this.petsService.findAllByOwner(user.userId, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: JwtPayload) {
    return this.petsService.findOneByOwner(id, user.userId, user);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePetDto: UpdatePetDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.petsService.update(id, updatePetDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: JwtPayload) {
    return this.petsService.remove(id, user);
  }
}
