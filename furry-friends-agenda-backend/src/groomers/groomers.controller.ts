import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { GroomersService } from './groomers.service';
import { CreateGroomerDto } from './dto/create-groomer.dto';
import { UpdateGroomerDto } from './dto/update-groomer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('groomers')
export class GroomersController {
  constructor(private readonly groomersService: GroomersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Body() createGroomerDto: CreateGroomerDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.groomersService.create(createGroomerDto, user);
  }

  @Get()
  findAll(@GetUser() user: JwtPayload) {
    return this.groomersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: JwtPayload) {
    return this.groomersService.findOne(id, user);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroomerDto: UpdateGroomerDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.groomersService.update(id, updateGroomerDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: JwtPayload) {
    return this.groomersService.remove(id, user);
  }
}
