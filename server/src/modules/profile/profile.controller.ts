import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('profile')
@Controller()
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @ApiBearerAuth()
  @Get('me/profile')
  getMine(@CurrentUser('sub') userId: string) {
    return this.service.getMine(userId);
  }

  @ApiBearerAuth()
  @Put('me/profile')
  upsertMine(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpsertProfileDto,
  ) {
    return this.service.upsertMine(userId, dto);
  }

  @Public()
  @Get('u/:username/profile')
  getPublic(@Param('username') username: string) {
    return this.service.getPublic(username);
  }
}
