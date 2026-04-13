import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserFactory } from '../factories/user.factory';
import { RegisterSellerDto } from '../dto/register-seller.dto';
import { LoginDto } from '../dto/login.dto';
import { UserReadModel } from '../../domain/read-models/user.read-model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registerSeller(dto: RegisterSellerDto): Promise<{ user: UserReadModel; accessToken: string; refreshToken: string }> {
    const existingByEmail = await this.userRepository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new BadRequestException('Email already registered');
    }

    const existingByPhone = await this.userRepository.findByPhone(dto.phone);
    if (existingByPhone) {
      throw new BadRequestException('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = UserFactory.createSeller(dto, passwordHash);
    const savedUser = await this.userRepository.save(user);

    const tokens = await this.generateTokens(savedUser);
    await this.userRepository.update(savedUser.id, { refreshToken: tokens.refreshToken });

    return {
      user: UserFactory.toReadModel(savedUser),
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<{ user: UserReadModel; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(dto.identifier)
      ?? await this.userRepository.findByPhone(dto.identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('Account suspended');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.userRepository.update(user.id, { refreshToken: tokens.refreshToken });

    return {
      user: UserFactory.toReadModel(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userRepository.findById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      await this.userRepository.update(user.id, { refreshToken: tokens.refreshToken });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '24h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }
}
