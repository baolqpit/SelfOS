import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { sanitizeRichHtml } from '../../common/utils/sanitize';
import { toSlug } from '../../common/utils/slug';

type DailyWritable = Omit<
  Prisma.DailyVlogUncheckedCreateInput,
  'userId' | 'slug'
>;

function mapDto(dto: CreateDailyDto | UpdateDailyDto): Partial<DailyWritable> {
  const data: Partial<DailyWritable> = {};
  if (dto.title !== undefined) data.title = dto.title;
  if (dto.content !== undefined)
    data.content = dto.content as Prisma.InputJsonValue;
  if (dto.contentHtml !== undefined)
    data.contentHtml = sanitizeRichHtml(dto.contentHtml);
  if (dto.coverUrl !== undefined) data.coverUrl = dto.coverUrl;
  if (dto.videos !== undefined)
    data.videos = dto.videos as Prisma.InputJsonValue;
  if (dto.images !== undefined)
    data.images = dto.images as Prisma.InputJsonValue;
  if (dto.tags !== undefined) data.tags = dto.tags;
  if (dto.publishedAt !== undefined)
    data.publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : null;
  if (dto.isPublished !== undefined) {
    data.isPublished = dto.isPublished;
    if (dto.isPublished && !dto.publishedAt) data.publishedAt = new Date();
  }
  return data;
}

@Injectable()
export class DailyService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string, q: PaginationDto) {
    const where: Prisma.DailyVlogWhereInput = { userId };
    if (q.isPublished !== undefined) where.isPublished = q.isPublished === 'true';
    if (q.q) where.title = { contains: q.q, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.dailyVlog.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.dailyVlog.count({ where }),
    ]);
    return { items, page: q.page, pageSize: q.pageSize, total };
  }

  async getMine(userId: string, id: string) {
    const item = await this.prisma.dailyVlog.findUnique({ where: { id } });
    if (!item) throw new NotFoundException();
    if (item.userId !== userId) throw new ForbiddenException();
    return item;
  }

  async create(userId: string, dto: CreateDailyDto) {
    const slug = await this.resolveUniqueSlug(userId, dto.slug ?? dto.title);
    const base = mapDto(dto);
    return this.prisma.dailyVlog.create({
      data: {
        ...(base as DailyWritable),
        title: dto.title,
        content: (dto.content as Prisma.InputJsonValue) ?? {},
        tags: dto.tags ?? [],
        userId,
        slug,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateDailyDto) {
    await this.getMine(userId, id);
    const data = mapDto(dto);
    if (dto.slug) data.slug = await this.resolveUniqueSlug(userId, dto.slug, id);
    return this.prisma.dailyVlog.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.getMine(userId, id);
    await this.prisma.dailyVlog.delete({ where: { id } });
    return { success: true };
  }

  async listPublic(username: string, q: PaginationDto) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    const where: Prisma.DailyVlogWhereInput = {
      userId: user.id,
      isPublished: true,
    };
    if (q.q) where.title = { contains: q.q, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.dailyVlog.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.dailyVlog.count({ where }),
    ]);
    return { items, page: q.page, pageSize: q.pageSize, total };
  }

  async getPublic(username: string, slug: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException();
    const item = await this.prisma.dailyVlog.findFirst({
      where: { userId: user.id, slug, isPublished: true },
    });
    if (!item) throw new NotFoundException();
    return item;
  }

  private async resolveUniqueSlug(
    userId: string,
    seed: string,
    ignoreId?: string,
  ): Promise<string> {
    const base = toSlug(seed) || 'daily';
    let candidate = base;
    let i = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.prisma.dailyVlog.findFirst({
        where: {
          userId,
          slug: candidate,
          ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
        },
        select: { id: true },
      });
      if (!existing) return candidate;
      i += 1;
      candidate = `${base}-${i}`;
    }
  }
}
