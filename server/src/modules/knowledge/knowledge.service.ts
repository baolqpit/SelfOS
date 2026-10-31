import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { sanitizeRichHtml } from '../../common/utils/sanitize';
import { toSlug } from '../../common/utils/slug';

type KnowledgeWritable = Omit<Prisma.KnowledgeUncheckedCreateInput, 'userId'>;

function mapDto(
  dto: CreateKnowledgeDto | UpdateKnowledgeDto,
): Partial<KnowledgeWritable> {
  const data: Partial<KnowledgeWritable> = {};
  if (dto.title !== undefined) data.title = dto.title;
  if (dto.content !== undefined)
    data.content = dto.content as unknown as Prisma.InputJsonValue;
  if (dto.contentHtml !== undefined)
    data.contentHtml = sanitizeRichHtml(dto.contentHtml);
  if (dto.method !== undefined) data.method = dto.method;
  if (dto.source !== undefined) data.source = dto.source;
  if (dto.startedAt !== undefined)
    data.startedAt = dto.startedAt ? new Date(dto.startedAt) : null;
  if (dto.completedAt !== undefined)
    data.completedAt = dto.completedAt ? new Date(dto.completedAt) : null;
  if (dto.certificateUrl !== undefined)
    data.certificateUrl = dto.certificateUrl;
  if (dto.certificatePublicId !== undefined)
    data.certificatePublicId = dto.certificatePublicId;
  if (dto.images !== undefined)
    data.images = dto.images as unknown as Prisma.InputJsonValue;
  if (dto.tags !== undefined) data.tags = dto.tags;
  if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;
  return data;
}

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string, q: PaginationDto) {
    const where: Prisma.KnowledgeWhereInput = { userId };
    if (q.isPublished !== undefined) where.isPublished = q.isPublished === 'true';
    if (q.q) where.title = { contains: q.q, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.knowledge.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.knowledge.count({ where }),
    ]);
    return { items, page: q.page, pageSize: q.pageSize, total };
  }

  async getMine(userId: string, id: string) {
    const item = await this.prisma.knowledge.findUnique({ where: { id } });
    if (!item) throw new NotFoundException();
    if (item.userId !== userId) throw new ForbiddenException();
    return item;
  }

  async create(userId: string, dto: CreateKnowledgeDto) {
    const slug = await this.resolveUniqueSlug(userId, dto.slug ?? dto.title);
    const base = mapDto(dto);
    return this.prisma.knowledge.create({
      data: {
        ...(base as KnowledgeWritable),
        title: dto.title,
        content: (dto.content as unknown as Prisma.InputJsonValue) ?? {},
        tags: dto.tags ?? [],
        userId,
        slug,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateKnowledgeDto) {
    await this.getMine(userId, id);
    const data = mapDto(dto);
    if (dto.slug) data.slug = await this.resolveUniqueSlug(userId, dto.slug, id);
    return this.prisma.knowledge.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.getMine(userId, id);
    await this.prisma.knowledge.delete({ where: { id } });
    return { success: true };
  }

  async listPublic(username: string, q: PaginationDto) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    const where: Prisma.KnowledgeWhereInput = {
      userId: user.id,
      isPublished: true,
    };
    if (q.q) where.title = { contains: q.q, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.knowledge.findMany({
        where,
        orderBy: [{ completedAt: 'desc' }, { updatedAt: 'desc' }],
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.knowledge.count({ where }),
    ]);
    return { items, page: q.page, pageSize: q.pageSize, total };
  }

  async getPublic(username: string, slug: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException();
    const item = await this.prisma.knowledge.findFirst({
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
    const base = toSlug(seed) || 'knowledge';
    let candidate = base;
    let i = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.prisma.knowledge.findFirst({
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
