import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../../aop/constants';
import { AuthService } from '../../../application/services/auth.service';
import { RegisterSellerRequestDto } from '../dto/input/register-seller.dto';
import { LoginRequestDto } from '../dto/input/login.dto';
import { AuthResponseDto } from '../dto/output/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/seller')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new seller account' })
  @ApiResponse({ status: 201, description: 'Seller registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error — invalid or missing fields' })
  @ApiResponse({ status: 409, description: 'Email or phone already registered' })
  async registerSeller(@Body() dto: RegisterSellerRequestDto): Promise<AuthResponseDto> {
    const result = await this.authService.registerSeller(dto);
    return {
      id: result.user.id,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      phone: result.user.phone,
      role: result.user.role,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email/phone and password' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto);
    return {
      id: result.user.id,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      phone: result.user.phone,
      role: result.user.role,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
