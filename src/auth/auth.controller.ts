import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class RegisterDto {
  @ApiProperty({ example: 'Shiv' })
  @IsString() name: string;

  @ApiProperty({ example: 'shiv@email.com' })
  @IsEmail() email: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString() @MinLength(6) password: string;
}

class LoginDto {
  @ApiProperty({ example: 'shiv@email.com' })
  @IsEmail() email: string;

  @ApiProperty({ example: '123456' })
  @IsString() password: string;
}

const AuthResponse = {
  schema: {
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: { id: '664f1b2c9e1a2b3c4d5e6f7a', name: 'Shiv', email: 'shiv@email.com' },
    },
  },
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered', ...AuthResponse })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', ...AuthResponse })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
