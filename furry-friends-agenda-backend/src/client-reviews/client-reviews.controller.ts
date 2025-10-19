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
  Query,
} from '@nestjs/common';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';
import {
  ClientReviewsService,
  CreateReviewDto,
} from './client-reviews.service';

@Controller('client/reviews')
@UseGuards(JwtClientGuard)
export class ClientReviewsController {
  constructor(private readonly clientReviewsService: ClientReviewsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientReviewsService.createReview(
      req.user.sub,
      createReviewDto,
    );
  }

  @Get()
  getClientReviews(@Request() req: { user: { sub: string } }) {
    return this.clientReviewsService.getClientReviews(req.user.sub);
  }

  @Get(':id')
  getReviewById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientReviewsService.getReviewById(id, req.user.sub);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: Partial<CreateReviewDto>,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientReviewsService.updateReview(
      id,
      req.user.sub,
      updateReviewDto,
    );
  }

  @Delete(':id')
  deleteReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientReviewsService.deleteReview(id, req.user.sub);
  }
}

@Controller('public/reviews')
export class PublicReviewsController {
  constructor(private readonly clientReviewsService: ClientReviewsService) {}

  @Get()
  getPublicReviews(@Query('groomerId') groomerId?: string) {
    return this.clientReviewsService.getPublicReviews(groomerId);
  }

  @Get('average-rating')
  getAverageRating(@Query('groomerId') groomerId?: string) {
    return this.clientReviewsService.getAverageRating(groomerId);
  }
}
