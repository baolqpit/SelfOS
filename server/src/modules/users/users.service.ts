import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsernameOrThrow(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, email: true },
    });
    if (!user) throw new NotFoundException(`User ${username} not found`);
    return user;
  }
}
