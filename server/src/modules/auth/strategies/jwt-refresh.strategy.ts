import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';

export interface RefreshPayload extends JwtPayload {
  refreshToken: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('jwt.refreshSecret')!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): RefreshPayload {
    const refreshToken = (req.body as { refreshToken?: string })?.refreshToken ?? '';
    return { ...payload, refreshToken };
  }
}
