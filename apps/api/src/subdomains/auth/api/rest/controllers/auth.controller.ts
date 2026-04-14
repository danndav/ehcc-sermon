import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../../aop/constants';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { AuthService } from '../../../application/services/auth.service';
import { LoginDto, SetPasswordDto, RegisterDto, CheckIdentifierDto } from '../dto/input/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if EA number or email exists and whether password is set' })
  @ApiResponse({ status: 200, description: 'Returns existence and password status' })
  async checkIdentifier(@Body() dto: CheckIdentifierDto) {
    return this.authService.checkIdentifier(dto.identifier);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with EA number or email + password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'PASSWORD_NOT_SET — user needs to set password first' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.identifier, dto.password);
  }

  @Post('set-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set password for first-time login (existing church member)' })
  @ApiResponse({ status: 200, description: 'Password set and logged in' })
  @ApiResponse({ status: 400, description: 'Password already set or email taken' })
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto.identifier, dto.password, dto.email);
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user (not existing church member)' })
  @ApiResponse({ status: 201, description: 'Registered and logged in' })
  @ApiResponse({ status: 400, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.currentUser.sub);
  }
}
