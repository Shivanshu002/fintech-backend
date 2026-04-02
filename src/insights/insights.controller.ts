import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Category-wise spending (current month)' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        { category: 'food', total: 3200 },
        { category: 'transport', total: 800 },
      ],
    },
  })
  categories(@GetUser() user: any) {
    return this.insightsService.getCategoryBreakdown(user.userId);
  }

  @Get('week-comparison')
  @ApiOperation({ summary: 'This week vs last week spending' })
  @ApiResponse({
    status: 200,
    schema: {
      example: { thisWeek: 1500, lastWeek: 2100, change: -28.57 },
    },
  })
  weekComparison(@GetUser() user: any) {
    return this.insightsService.getWeekComparison(user.userId);
  }

  @Get('monthly-trend')
  @ApiOperation({ summary: 'Last 6 months income/expense trend' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        { month: 'Jan', income: 5000, expense: 3200 },
        { month: 'Feb', income: 5500, expense: 2900 },
      ],
    },
  })
  monthlyTrend(@GetUser() user: any) {
    return this.insightsService.getMonthlyTrend(user.userId);
  }

  @Get('smart')
  @ApiOperation({ summary: 'Smart tips and top insights' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        tips: ['You spent 20% more on food this month'],
        topCategory: 'food',
        savingsRate: 36,
      },
    },
  })
  smart(@GetUser() user: any) {
    return this.insightsService.getSmartInsights(user.userId);
  }
}
