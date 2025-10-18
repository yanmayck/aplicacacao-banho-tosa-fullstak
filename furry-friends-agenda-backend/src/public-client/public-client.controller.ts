import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PublicClientService } from './public-client.service';
import { PublicClientRegisterDto } from './dto/public-client-register.dto';
import { PublicClientLoginDto } from './dto/public-client-login.dto';

@Controller('public')
export class PublicClientController {
  constructor(private readonly publicClientService: PublicClientService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: PublicClientRegisterDto) {
    return this.publicClientService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: PublicClientLoginDto) {
    return this.publicClientService.login(loginDto);
  }

  @Get('profile/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.publicClientService.findById(id);
  }
}
