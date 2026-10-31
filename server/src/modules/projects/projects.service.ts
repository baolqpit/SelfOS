import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { sanitizeRichHtml } from '../../common/utils/sanitize';
import { toSlug } from '../../common/utils/slug';

type ProjectWritable = Omit<Prisma.ProjectUncheckedCreateInput, 'userId'>;

function mapDto(
  dto: CreateProjectDto | UpdateProjectDto,
): Partial<ProjectWritable> {
  const data: Partial<ProjectWritable> = {};
  if (dto.name !== undefined) data.name = dto.name;
  if (dto.summary !== undefined) data.summary = dto.summary;
  if (dto.content !== undefined)
    data.content = dto.content as unknown as Prisma.InputJsonValue;
  if (dto.contentHtml !== undefined)
    data.contentHtml = sanitizeRichHtml(dto.contentHtml);
  if (dto.coverUrl !== undefined) data.coverUrl = dto.coverUrl;
  if (dto.coverPublicId !== undefined) data.coverPublicId = dto.coverPublicId;
  if (dto.startDate !== undefined)
    data.startDate = dto.startDate ? new Date(dto.startDate) : null;
  if (dto.endDate !== undefined)
    data.endDate = dto.endDate ? new Date(dto.endDate) : null;
  if (dto.teamSize !== undefined) data.teamSize = dto.teamSize;
  if (dto.technologies !== undefined) data.technologies = dto.technologies;
  if (dto.results !== undefined) data.results = dto.results;
  if (dto.revenue !== undefined) {
    data.revenueAmount = new Prisma.Decimal(dto.revenue.amount);
    data.revenueCurrency = dto.revenue.currency;
  }
  if (dto.client !== undefined) data.client = dto.client;
  if (dto.role !== undefined) data.role = dto.role;
  if (dto.links !== undefined)
    data.links = dto.links as unknown as Prisma.InputJsonValue;
  if (dto.gallery !== undefined)
    data.gallery = dto.gallery as unknown as Prisma.InputJsonValue;
  if (dto.isPublished !== undefined) {
    data.isPublished = dto.isPublished;
    data.publishedAt = dto.isPublished ? new Date() : null;
  }
  return data;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string, q: PaginationDto) {
    const where: Prisma.ProjectWhereInput = { userId };
    if (q.isPublished !== undefined) where.isPublished = q.isPublished === 'true';
    if (q.q) where.name = { contains: q.q, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.project.count({ where }),
    ]);
    return { items, page: q.page, pageSize: q.pageSize, total };
  }

  async getMine(userId: string, id: string) {
    const item = await this.prisma.project.findUnique({ where: { id } });
    if (!item) throw new NotFoundException();
    if (item.userId !== userId) throw new ForbiddenException();
    return item;
  }

  async create(userId: string, dto: CreateProjectDto) {
    const base = mapDto(dto);
    const slug = await this.resolveUniqueSlug(
      userId,
      dto.slug ?? dto.name,
    );
    return this.prisma.project.create({
      data: {
        ...(base as ProjectWritable),
        name: dto.name,
        content: (dto.content as unknown as Prisma.InputJsonValue) ?? {},
        technologies: dto.technologies ?? [],
        userId,
        slug,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    await this.getMine(userId, id);
    const data = mapDto(dto);
    if (dto.slug) {
      data.slug = await this.resolveUniqueSlug(userId, dto.slug, id);
    }
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    await this.getMine(userId, id);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }

  async listPublic(username: string, q: PaginationDto) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    const where: Prisma.ProjectWhereInput = {
      userId: user.id,
      isPublished: true,
    };
    if (q.q) where.name = { contains: q.q, mode: 'insensitive' };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.project.count({ where }),
    ]);
    return { items, page: q.page, pageSize: q.pageSize, total };
  }

  async getPublic(username: string, slug: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException();
    const item = await this.prisma.project.findFirst({
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
    const base = toSlug(seed) || 'project';
    let candidate = base;
    let i = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.prisma.project.findFirst({
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
