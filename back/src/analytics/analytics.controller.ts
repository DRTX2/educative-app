import { Controller, Get, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { MyLearningOverview } from './domain/my-learning-overview';
import { AdminLearningOverview } from './domain/admin-learning-overview';
import { AdminLearnerSummary } from './domain/admin-learner-summary';
import { AdminContentSummary } from './domain/admin-content-summary';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiBearerAuth()
@ApiTags('Analytics')
@Controller({
  path: 'analytics',
  version: '1',
})
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOkResponse({
    type: MyLearningOverview,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('me/overview')
  @HttpCode(HttpStatus.OK)
  getMyOverview(@Request() request): Promise<MyLearningOverview> {
    return this.analyticsService.getMyOverview(request.user.id);
  }

  @ApiOkResponse({
    type: AdminLearningOverview,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('admin/overview')
  @HttpCode(HttpStatus.OK)
  getAdminOverview(): Promise<AdminLearningOverview> {
    return this.analyticsService.getAdminOverview();
  }

  @ApiOkResponse({
    type: AdminLearnerSummary,
    isArray: true,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('admin/learners')
  @HttpCode(HttpStatus.OK)
  getAdminLearners(): Promise<AdminLearnerSummary[]> {
    return this.analyticsService.getAdminLearners();
  }

  @ApiOkResponse({
    type: AdminContentSummary,
    isArray: true,
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('admin/content')
  @HttpCode(HttpStatus.OK)
  getAdminContentSummary(): Promise<AdminContentSummary[]> {
    return this.analyticsService.getAdminContentSummary();
  }
}
