import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  getMine(userId: string) {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  upsertMine(userId: string, dto: UpsertProfileDto) {
    const data = {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
    };
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async getPublic(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { profile: true, settings: true },
    });
    if (!user || !user.profile) throw new NotFoundException('Profile not found');

    const vis = (user.settings?.modulesVisibility as
      | { profile?: { visible?: boolean; fields?: Record<string, boolean> } }
      | undefined)?.profile;

    if (vis && vis.visible === false) {
      throw new NotFoundException('Profile is not public');
    }

    const fields = vis?.fields ?? {};
    const p = user.profile;
    // Only expose fields where visibility flag is truthy (default: visible)
    const show = (k: string) => fields[k] !== false;
    return {
      username: user.username,
      fullName: p.fullName,
      email: show('email') ? p.email : undefined,
      phone: show('phone') ? p.phone : undefined,
      address: show('address') ? p.address : undefined,
      dateOfBirth: show('dateOfBirth') ? p.dateOfBirth : undefined,
      occupation: show('occupation') ? p.occupation : undefined,
      bio: show('bio') ? p.bio : undefined,
      avatarUrl: show('avatarUrl') ? p.avatarUrl : undefined,
      coverUrl: show('coverUrl') ? p.coverUrl : undefined,
      socialLinks: show('socialLinks') ? p.socialLinks : undefined,
    };
  }
}
