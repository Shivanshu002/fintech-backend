import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

class UpdateProfileDto {
  @ApiProperty({ example: 'Shiv Kumar', required: false })
  name?: string;

  @ApiProperty({ example: 'newemail@email.com', required: false })
  email?: string;
}

const UserResponse = {
  schema: {
    example: {
      _id: '664f1b2c9e1a2b3c4d5e6f7a',
      name: 'Shiv',
      email: 'shiv@email.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  },
};

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiResponse({ status: 200, description: 'User profile', ...UserResponse })
  getProfile(@GetUser() user: any) {
    return this.usersService.findById(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Updated profile', ...UserResponse })
  updateProfile(@GetUser() user: any, @Body() body: any) {
    return this.usersService.updateProfile(user.userId, body);
  }
}
