import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { validateEnv } from './config/env.validation';
import { configuration } from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DailyModule } from './modules/daily/daily.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { SettingsModule } from './modules/settings/settings.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { HealthController } from './health/health.controller';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (raw) => configuration(validateEnv(raw)) as unknown as Record<string, unknown>,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        pinoHttp: {
          level: cfg.get('nodeEnv') === 'production' ? 'info' : 'debug',
          transport:
            cfg.get('nodeEnv') === 'production'
              ? undefined
              : { target: 'pino-pretty', options: { singleLine: true } },
          redact: ['req.headers.authorization', 'req.headers.cookie'],
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => [
        {
          ttl: (cfg.get<number>('throttle.ttl') ?? 60) * 1000,
          limit: cfg.get<number>('throttle.limit') ?? 60,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    ProjectsModule,
    DailyModule,
    KnowledgeModule,
    SettingsModule,
    CloudinaryModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
