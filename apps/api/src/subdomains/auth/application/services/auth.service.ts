import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserReadModel } from '../../domain/read-models/user.read-model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Login with EA number or email + password.
   * If user hasn't set a password yet, prompt them to set one.
   */
  async login(identifier: string, password: string): Promise<{ user: UserReadModel; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('No account found with that EA number or email');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('Account suspended. Contact admin.');
    }

    if (!user.passwordSet || !user.passwordHash) {
      throw new BadRequestException('PASSWORD_NOT_SET');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Update last login
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const tokens = await this.generateTokens(user);
    await this.userRepository.update(user.id, { refreshToken: tokens.refreshToken });

    return {
      user: this.toReadModel(user),
      ...tokens,
    };
  }

  /**
   * Set password for first-time login.
   * User provides their EA number or email to identify themselves, then sets a password.
   */
  async setPassword(identifier: string, password: string, email?: string): Promise<{ user: UserReadModel; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('No account found with that EA number or email');
    }

    if (user.passwordSet) {
      throw new BadRequestException('Password already set. Use login instead.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const updateData: Partial<User> = {
      passwordHash,
      passwordSet: true,
      lastLoginAt: new Date(),
    };

    // If user provided email and doesn't have one yet, save it
    if (email && !user.email) {
      // Check email not already taken
      const existingEmail = await this.userRepository.findByEmail(email);
      if (existingEmail && existingEmail.id !== user.id) {
        throw new BadRequestException('Email already in use by another account');
      }
      updateData.email = email.toLowerCase();
    }

    await this.userRepository.update(user.id, updateData);
    const updatedUser = await this.userRepository.findById(user.id);

    const tokens = await this.generateTokens(updatedUser!);
    await this.userRepository.update(user.id, { refreshToken: tokens.refreshToken });

    return {
      user: this.toReadModel(updatedUser!),
      ...tokens,
    };
  }

  /**
   * Register a completely new user (not in the church database).
   */
  async register(name: string, email: string, password: string): Promise<{ user: UserReadModel; accessToken: string; refreshToken: string }> {
    const existingEmail = await this.userRepository.findByEmail(email.toLowerCase());
    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new User();
    user.name = name;
    user.email = email.toLowerCase();
    user.passwordHash = passwordHash;
    user.passwordSet = true;

    const savedUser = await this.userRepository.save(user);

    const tokens = await this.generateTokens(savedUser);
    await this.userRepository.update(savedUser.id, { refreshToken: tokens.refreshToken });

    return {
      user: this.toReadModel(savedUser),
      ...tokens,
    };
  }

  /**
   * Check if an identifier (EA number or email) exists and whether password is set.
   */
  async checkIdentifier(identifier: string): Promise<{ exists: boolean; passwordSet: boolean; name: string | null }> {
    const user = await this.userRepository.findByIdentifier(identifier);
    if (!user) {
      return { exists: false, passwordSet: false, name: null };
    }
    return { exists: true, passwordSet: user.passwordSet, name: user.name };
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

  async getProfile(userId: number): Promise<UserReadModel> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return this.toReadModel(user);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, eaNumber: user.eaNumber, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '24h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  private toReadModel(user: User): UserReadModel {
    return {
      id: user.id,
      eaNumber: user.eaNumber,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended,
      passwordSet: user.passwordSet,
      branchId: user.branchId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
