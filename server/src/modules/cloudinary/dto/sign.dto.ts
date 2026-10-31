import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class SignUploadDto {
  @ApiPropertyOptional({
    example: 'projects/taskly',
    description:
      'Subfolder lồng trong per-user root `selfos/{userId}`. Chỉ chữ/số/dash/underscore/slash.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9/_-]{0,120}$/i, {
    message: 'folder must be alphanumeric with dashes/underscores/slashes',
  })
  folder?: string;

  @ApiProperty({
    enum: ['image', 'video', 'raw', 'auto'],
    example: 'image',
    default: 'image',
  })
  @IsIn(['image', 'video', 'raw', 'auto'])
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image';
}
