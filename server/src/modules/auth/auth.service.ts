import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';

const DEFAULT_MODULES_VISIBILITY = {
  profile: {
    visible: true,
    fields: {
      fullName: true,
      email: true,
      phone: false,
      address: false,
      dateOfBirth: false,
      occupation: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      socialLinks: true,
    },
  },
  projects: { visible: true, showRevenue: false, showClient: true },
  daily: { visible: true },
  knowledge: { visible: true, showCertificates: true },
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  private hashRefresh(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async hashPassword(plain: string) {
    return argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  private async signTokens(payload: JwtPayload) {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.cfg.get<string>('jwt.accessSecret')!,
      expiresIn: this.cfg.get<string>('jwt.accessTtl')!,
    });
    // Include a random jti so each refresh token hash is unique even for
    // simultaneous issues to the same user.
    const refreshToken = await this.jwt.signAsync(
      { ...payload, jti: randomBytes(16).toString('hex') },
      {
        secret: this.cfg.get<string>('jwt.refreshSecret')!,
        expiresIn: this.cfg.get<string>('jwt.refreshTtl')!,
      },
    );
    return { accessToken, refreshToken };
  }

  private async persistRefresh(userId: string, refreshToken: string) {
    const tokenHash = this.hashRefresh(refreshToken);
    const decoded = this.jwt.decode(refreshToken) as { exp?: number };
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 30 * 24 * 3600 * 1000);
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async register(email: string, username: string, password: string) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true, email: true, username: true },
    });
    if (exists) {
      throw new ConflictException(
        exists.email === email ? 'Email already in use' : 'Username taken',
      );
    }

    const passwordHash = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        profile: { create: { fullName: username, email } },
        settings: {
          create: {
            theme: 'system',
            layout: 'grid',
            modulesVisibility: DEFAULT_MODULES_VISIBILITY,
          },
        },
      },
      select: { id: true, email: true, username: true, createdAt: true },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const tokens = await this.signTokens(payload);
    await this.persistRefresh(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  async login(emailOrUsername: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const tokens = await this.signTokens(payload);
    await this.persistRefresh(user.id, tokens.refreshToken);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async refresh(userId: string, oldRefreshToken: string) {
    const hash = this.hashRefresh(oldRefreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
    });
    if (!stored || stored.userId !== userId || stored.revokedAt) {
      throw new UnauthorizedException('Refresh token invalid or revoked');
    }
    if (stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User no longer exists');

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const tokens = await this.signTokens(payload);
    await this.persistRefresh(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
