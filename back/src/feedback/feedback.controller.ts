import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FeedbackService } from './feedback.service';
import { Feedback } from './domain/feedback';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Feedback')
@Controller({
  path: 'feedback',
  version: '1',
})
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiCreatedResponse({
    type: Feedback,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() request,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.create(request.user.id, createFeedbackDto);
  }

  @ApiOkResponse({
    type: Feedback,
    isArray: true,
  })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMyFeedback(@Request() request): Promise<Feedback[]> {
    return this.feedbackService.findByUser(request.user.id);
  }
}
