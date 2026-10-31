import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

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
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const existing = await this.prisma.settings.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.settings.create({
      data: {
        userId,
        theme: 'system',
        layout: 'grid',
        modulesVisibility: DEFAULT_MODULES_VISIBILITY,
      },
    });
  }

  updateMine(userId: string, dto: UpdateSettingsDto) {
    return this.prisma.settings.upsert({
      where: { userId },
      create: {
        userId,
        theme: dto.theme ?? 'system',
        layout: dto.layout ?? 'grid',
        accentColor: dto.accentColor,
        modulesVisibility: (dto.modulesVisibility ??
          DEFAULT_MODULES_VISIBILITY) as object,
        seo: dto.seo as object | undefined,
        customDomain: dto.customDomain,
      },
      update: {
        ...(dto.theme !== undefined && { theme: dto.theme }),
        ...(dto.layout !== undefined && { layout: dto.layout }),
        ...(dto.accentColor !== undefined && { accentColor: dto.accentColor }),
        ...(dto.modulesVisibility !== undefined && {
          modulesVisibility: dto.modulesVisibility as object,
        }),
        ...(dto.seo !== undefined && { seo: dto.seo as object }),
        ...(dto.customDomain !== undefined && { customDomain: dto.customDomain }),
      },
    });
  }

  async getPublicSubset(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { settings: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const s = user.settings;
    return {
      theme: s?.theme ?? 'system',
      accentColor: s?.accentColor ?? null,
      layout: s?.layout ?? 'grid',
      modulesVisibility: s?.modulesVisibility ?? DEFAULT_MODULES_VISIBILITY,
      seo: s?.seo ?? null,
    };
  }
}
