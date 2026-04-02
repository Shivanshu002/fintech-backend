import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txnService: TransactionsService) {}

  // POST /api/transactions
  @Post()
  create(@GetUser() user: any, @Body() body: any) {
    return this.txnService.create(user.userId, body);
  }

  // GET /api/transactions?type=&category=&startDate=&endDate=&search=&limit=
  @Get()
  findAll(@GetUser() user: any, @Query() query: any) {
    return this.txnService.findAll(user.userId, query);
  }

  // GET /api/transactions/summary
  @Get('summary')
  getSummary(@GetUser() user: any) {
    return this.txnService.getSummary(user.userId);
  }

  // GET /api/transactions/:id
  @Get(':id')
  findOne(@GetUser() user: any, @Param('id') id: string) {
    return this.txnService.findOne(user.userId, id);
  }

  // PATCH /api/transactions/:id
  @Patch(':id')
  update(@GetUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.txnService.update(user.userId, id, body);
  }

  // DELETE /api/transactions/:id
  @Delete(':id')
  remove(@GetUser() user: any, @Param('id') id: string) {
    return this.txnService.remove(user.userId, id);
  }
}
