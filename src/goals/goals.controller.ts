import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // POST /api/goals
  @Post()
  create(@GetUser() user: any, @Body() body: any) {
    return this.goalsService.create(user.userId, body);
  }

  // GET /api/goals
  @Get()
  findAll(@GetUser() user: any) {
    return this.goalsService.findAll(user.userId);
  }

  // GET /api/goals/summary
  @Get('summary')
  summary(@GetUser() user: any) {
    return this.goalsService.getStreakSummary(user.userId);
  }

  // GET /api/goals/:id
  @Get(':id')
  findOne(@GetUser() user: any, @Param('id') id: string) {
    return this.goalsService.findOne(user.userId, id);
  }

  // PATCH /api/goals/:id
  @Patch(':id')
  update(@GetUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.goalsService.update(user.userId, id, body);
  }

  // POST /api/goals/:id/add-amount
  @Post(':id/add-amount')
  addAmount(@GetUser() user: any, @Param('id') id: string, @Body('amount') amount: number) {
    return this.goalsService.addAmount(user.userId, id, amount);
  }

  // DELETE /api/goals/:id
  @Delete(':id')
  remove(@GetUser() user: any, @Param('id') id: string) {
    return this.goalsService.remove(user.userId, id);
  }
}
