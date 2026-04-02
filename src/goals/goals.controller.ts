import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

class CreateGoalDto {
  @ApiProperty({ example: 'Buy a Laptop' })
  title: string;

  @ApiProperty({ example: 50000 })
  targetAmount: number;

  @ApiProperty({ example: '2024-12-31' })
  deadline: string;
}

class AddAmountDto {
  @ApiProperty({ example: 5000 })
  amount: number;
}

const GoalExample = {
  _id: '664f1b2c9e1a2b3c4d5e6f7c',
  title: 'Buy a Laptop',
  targetAmount: 50000,
  savedAmount: 15000,
  deadline: '2024-12-31T00:00:00.000Z',
  isCompleted: false,
  userId: '664f1b2c9e1a2b3c4d5e6f7a',
};

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a goal' })
  @ApiBody({ type: CreateGoalDto })
  @ApiResponse({ status: 201, schema: { example: GoalExample } })
  create(@GetUser() user: any, @Body() body: any) {
    return this.goalsService.create(user.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals' })
  @ApiResponse({ status: 200, schema: { example: [GoalExample] } })
  findAll(@GetUser() user: any) {
    return this.goalsService.findAll(user.userId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Goals summary (active & completed count)' })
  @ApiResponse({
    status: 200,
    schema: { example: { active: 3, completed: 2, totalSaved: 25000 } },
  })
  summary(@GetUser() user: any) {
    return this.goalsService.getStreakSummary(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single goal' })
  @ApiParam({ name: 'id', example: '664f1b2c9e1a2b3c4d5e6f7c' })
  @ApiResponse({ status: 200, schema: { example: GoalExample } })
  findOne(@GetUser() user: any, @Param('id') id: string) {
    return this.goalsService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal' })
  @ApiParam({ name: 'id', example: '664f1b2c9e1a2b3c4d5e6f7c' })
  @ApiBody({ type: CreateGoalDto })
  @ApiResponse({ status: 200, schema: { example: GoalExample } })
  update(@GetUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.goalsService.update(user.userId, id, body);
  }

  @Post(':id/add-amount')
  @ApiOperation({ summary: 'Add money to a goal' })
  @ApiParam({ name: 'id', example: '664f1b2c9e1a2b3c4d5e6f7c' })
  @ApiBody({ type: AddAmountDto })
  @ApiResponse({ status: 201, schema: { example: { ...GoalExample, savedAmount: 20000 } } })
  addAmount(@GetUser() user: any, @Param('id') id: string, @Body('amount') amount: number) {
    return this.goalsService.addAmount(user.userId, id, amount);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal' })
  @ApiParam({ name: 'id', example: '664f1b2c9e1a2b3c4d5e6f7c' })
  @ApiResponse({ status: 200, schema: { example: { message: 'Deleted successfully' } } })
  remove(@GetUser() user: any, @Param('id') id: string) {
    return this.goalsService.remove(user.userId, id);
  }
}
