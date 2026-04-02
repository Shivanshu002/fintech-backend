import { Controller, Get, UseGuards } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  // GET /api/insights/categories
  @Get('categories')
  categories(@GetUser() user: any) {
    return this.insightsService.getCategoryBreakdown(user.userId);
  }

  // GET /api/insights/week-comparison
  @Get('week-comparison')
  weekComparison(@GetUser() user: any) {
    return this.insightsService.getWeekComparison(user.userId);
  }

  // GET /api/insights/monthly-trend
  @Get('monthly-trend')
  monthlyTrend(@GetUser() user: any) {
    return this.insightsService.getMonthlyTrend(user.userId);
  }

  // GET /api/insights/smart
  @Get('smart')
  smart(@GetUser() user: any) {
    return this.insightsService.getSmartInsights(user.userId);
  }
}
