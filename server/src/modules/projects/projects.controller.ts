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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('projects')
@Controller()
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @ApiBearerAuth()
  @Get('me/projects')
  listMine(
    @CurrentUser('sub') userId: string,
    @Query() q: PaginationDto,
  ) {
    return this.service.listMine(userId, q);
  }

  @ApiBearerAuth()
  @Post('me/projects')
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.service.create(userId, dto);
  }

  @ApiBearerAuth()
  @Get('me/projects/:id')
  getMine(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.service.getMine(userId, id);
  }

  @ApiBearerAuth()
  @Patch('me/projects/:id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  @ApiBearerAuth()
  @Delete('me/projects/:id')
  remove(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.service.remove(userId, id);
  }

  @Public()
  @Get('u/:username/projects')
  listPublic(
    @Param('username') username: string,
    @Query() q: PaginationDto,
  ) {
    return this.service.listPublic(username, q);
  }

  @Public()
  @Get('u/:username/projects/:slug')
  getPublic(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    return this.service.getPublic(username, slug);
  }
}
