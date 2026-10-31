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
import { DailyService } from './daily.service';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('daily')
@Controller()
export class DailyController {
  constructor(private readonly service: DailyService) {}

  @ApiBearerAuth()
  @Get('me/daily')
  listMine(@CurrentUser('sub') userId: string, @Query() q: PaginationDto) {
    return this.service.listMine(userId, q);
  }

  @ApiBearerAuth()
  @Post('me/daily')
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateDailyDto) {
    return this.service.create(userId, dto);
  }

  @ApiBearerAuth()
  @Get('me/daily/:id')
  getMine(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.service.getMine(userId, id);
  }

  @ApiBearerAuth()
  @Patch('me/daily/:id')
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDailyDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  @ApiBearerAuth()
  @Delete('me/daily/:id')
  remove(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.service.remove(userId, id);
  }

  @Public()
  @Get('u/:username/daily')
  listPublic(@Param('username') username: string, @Query() q: PaginationDto) {
    return this.service.listPublic(username, q);
  }

  @Public()
  @Get('u/:username/daily/:slug')
  getPublic(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    return this.service.getPublic(username, slug);
  }
}
