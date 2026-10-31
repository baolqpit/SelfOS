import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('settings')
@Controller()
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @ApiBearerAuth()
  @Get('me/settings')
  getMine(@CurrentUser('sub') userId: string) {
    return this.service.getMine(userId);
  }

  @ApiBearerAuth()
  @Put('me/settings')
  updateMine(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.service.updateMine(userId, dto);
  }

  @Public()
  @Get('u/:username/settings/public')
  getPublic(@Param('username') username: string) {
    return this.service.getPublicSubset(username);
  }
}
