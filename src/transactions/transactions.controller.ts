import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

class CreateTransactionDto {
  @ApiProperty({ example: 850 })
  amount: number;

  @ApiProperty({ example: 'expense', enum: ['income', 'expense'] })
  type: string;

  @ApiProperty({ example: 'food' })
  category: string;

  @ApiProperty({ example: '2024-04-02' })
  date: string;

  @ApiProperty({ example: 'Groceries', required: false })
  note?: string;
}

const TxnExample = {
  _id: '664f1b2c9e1a2b3c4d5e6f7b',
  amount: 850,
  type: 'expense',
  category: 'food',
  date: '2024-04-02T00:00:00.000Z',
  note: 'Groceries',
  userId: '664f1b2c9e1a2b3c4d5e6f7a',
};

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txnService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transaction created', schema: { example: TxnExample } })
  create(@GetUser() user: any, @Body() body: any) {
    return this.txnService.create(user.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions (with filters)' })
  @ApiQuery({ name: 'type', required: false, example: 'expense' })
  @ApiQuery({ name: 'category', required: false, example: 'food' })
  @ApiQuery({ name: 'startDate', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2024-12-31' })
  @ApiQuery({ name: 'search', required: false, example: 'groceries' })
  @ApiResponse({ status: 200, description: 'List of transactions', schema: { example: [TxnExample] } })
  findAll(@GetUser() user: any, @Query() query: any) {
    return this.txnService.findAll(user.userId, query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get income / expense / balance summary' })
  @ApiResponse({
    status: 200,
    schema: { example: { totalIncome: 5000, totalExpense: 3200, balance: 1800 } },
  })
  getSummary(@GetUser() user: any) {
    return this.txnService.getSummary(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single transaction' })
  @ApiParam({ name: 'id', example: '664f1b2c9e1a2b3c4d5e6f7b' })
  @ApiResponse({ status: 200, schema: { example: TxnExample } })
  findOne(@GetUser() user: any, @Param('id') id: string) {
    return this.txnService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', example: '664f1b2c9e1a2b3c4d5e6f7b' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 200, schema: { example: TxnExample } })
  update(@GetUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.txnService.update(user.userId, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', example: '664f1b2c9e1a2b3c4d5e6f7b' })
  @ApiResponse({ status: 200, schema: { example: { message: 'Deleted successfully' } } })
  remove(@GetUser() user: any, @Param('id') id: string) {
    return this.txnService.remove(user.userId, id);
  }
}
