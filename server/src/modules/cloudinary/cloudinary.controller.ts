import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { SignUploadDto } from './dto/sign.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('cloudinary')
@ApiBearerAuth()
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly service: CloudinaryService) {}

  @Post('sign')
  sign(@CurrentUser('sub') userId: string, @Body() dto: SignUploadDto) {
    return this.service.sign(userId, dto.folder, dto.resourceType);
  }
}
