import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { MediaItemDto } from '../../projects/dto/common.dto';

const SAMPLE_DAILY_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Sáng nay thử ' },
        { type: 'text', marks: [{ type: 'italic' }], text: 'pour-over V60' },
        { type: 'text', text: ' với hạt Ethiopia, cảm giác citrusy rõ rệt.' },
      ],
    },
  ],
};

export class CreateDailyDto {
  @ApiProperty({ example: 'Nhật ký ngày 15 — pour-over V60', maxLength: 200 })
  @IsString() @Length(2, 200)
  title!: string;

  @ApiPropertyOptional({ example: 'nhat-ky-ngay-15-pour-over-v60' })
  @IsOptional() @IsString() @Length(2, 200)
  slug?: string;

  @ApiProperty({
    description: 'Nội dung TipTap JSON.',
    example: SAMPLE_DAILY_DOC,
  })
  @IsObject()
  content!: Record<string, unknown>;

  @ApiPropertyOptional({
    example: '<p>Sáng nay thử <em>pour-over V60</em> với hạt Ethiopia.</p>',
  })
  @IsOptional() @IsString()
  contentHtml?: string;

  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1700000000/selfos/alice/daily/15/cover.jpg',
  })
  @IsOptional() @IsUrl() coverUrl?: string;

  @ApiPropertyOptional({ type: [MediaItemDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  videos?: MediaItemDto[];

  @ApiPropertyOptional({ type: [MediaItemDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  images?: MediaItemDto[];

  @ApiProperty({ example: ['coffee', 'daily', 'morning'], isArray: true, maxItems: 50 })
  @IsArray() @ArrayMaxSize(50) @IsString({ each: true })
  tags: string[] = [];

  @ApiPropertyOptional({ example: '2024-10-15T08:30:00.000Z', format: 'date-time' })
  @IsOptional() @IsISO8601()
  publishedAt?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional() @IsBoolean()
  isPublished?: boolean = false;
}
