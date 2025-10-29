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
  UseGuards,
  Req,
} from '@nestjs/common';
import { PublicClientService } from './public-client.service';
import { PublicClientRegisterDto } from './dto/public-client-register.dto';
import { PublicClientLoginDto } from './dto/public-client-login.dto';
import { PublicTenantGuard } from '../auth/guards/public-tenant.guard';
import { PublicFeature } from '../auth/decorators/public-feature.decorator';

@Controller('public')
@UseGuards(PublicTenantGuard)
export class PublicClientController {
  constructor(private readonly publicClientService: PublicClientService) {}

  @Post('register')
  @PublicFeature('appointments')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(
    @Body() registerDto: PublicClientRegisterDto,
    @Req() req: any,
  ) {
    return this.publicClientService.register(registerDto, req);
  }

  @Post('login')
  @PublicFeature('appointments')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: PublicClientLoginDto, @Req() req: any) {
    return this.publicClientService.login(loginDto, req);
  }

  @Get('profile/:id')
  @PublicFeature('appointments')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.publicClientService.findById(id, req);
  }
}
