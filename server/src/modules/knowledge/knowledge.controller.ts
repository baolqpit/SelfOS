import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('knowledge')
@Controller()
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  @ApiBearerAuth()
  @Get('me/knowledge')
  listMine(@CurrentUser('sub') userId: string, @Query() q: PaginationDto) {
    return this.service.listMine(userId, q);
  }

  @ApiBearerAuth()
  @Post('me/knowledge')
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateKnowledgeDto) {
    return this.service.create(userId, dto);
  }

  @ApiBearerAuth()
  @Get('me/knowledge/:id')
  getMine(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.service.getMine(userId, id);
  }

  @ApiBearerAuth()
  @Patch('me/knowledge/:id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateKnowledgeDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  @ApiBearerAuth()
  @Delete('me/knowledge/:id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.service.remove(userId, id);
  }

  @Public()
  @Get('u/:username/knowledge')
  listPublic(@Param('username') username: string, @Query() q: PaginationDto) {
    return this.service.listPublic(username, q);
  }

  @Public()
  @Get('u/:username/knowledge/:slug')
  getPublic(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    return this.service.getPublic(username, slug);
  }
}
