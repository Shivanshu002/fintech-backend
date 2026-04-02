import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@GetUser() user: any) {
    return this.usersService.findById(user.userId);
  }

  @Patch('me')
  updateProfile(@GetUser() user: any, @Body() body: any) {
    return this.usersService.updateProfile(user.userId, body);
  }
}
