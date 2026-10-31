import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { LinkDto, MediaItemDto, RevenueDto } from './common.dto';

const SAMPLE_TIPTAP_DOC = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Tổng quan' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Ứng dụng ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'quản lý công việc' },
        { type: 'text', text: ' cho đội nhóm nhỏ, hỗ trợ realtime.' },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Realtime sync qua WebSocket' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Dark mode & keyboard shortcut' }],
            },
          ],
        },
      ],
    },
  ],
};

export class CreateProjectDto {
  @ApiProperty({ example: 'Taskly — Realtime team planner', maxLength: 160 })
  @IsString() @Length(2, 160)
  name!: string;

  @ApiPropertyOptional({
    example: 'taskly-realtime-team-planner',
    description: 'Nếu bỏ trống, server sẽ tự sinh từ tên.',
  })
  @IsOptional() @IsString() @Length(2, 200)
  slug?: string;

  @ApiPropertyOptional({
    example:
      'SaaS quản lý task cho startup — realtime, phím tắt, tích hợp GitHub & Slack.',
    maxLength: 500,
  })
  @IsOptional() @IsString() @MaxLength(500)
  summary?: string;

  @ApiProperty({
    description: 'Nội dung dạng TipTap JSON (ProseMirror document).',
    example: SAMPLE_TIPTAP_DOC,
  })
  @IsObject()
  content!: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'HTML đã render từ TipTap — tùy chọn, server sẽ sanitize.',
    example:
      '<h2>Tổng quan</h2><p>Ứng dụng <strong>quản lý công việc</strong> cho đội nhóm nhỏ.</p>',
  })
  @IsOptional() @IsString()
  contentHtml?: string;

  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1700000000/selfos/alice/projects/taskly/cover.jpg',
  })
  @IsOptional() @IsUrl() coverUrl?: string;

  @ApiPropertyOptional({ example: 'selfos/alice/projects/taskly/cover' })
  @IsOptional() @IsString() coverPublicId?: string;

  @ApiPropertyOptional({ example: '2024-03-01', format: 'date' })
  @IsOptional() @IsISO8601() startDate?: string;

  @ApiPropertyOptional({ example: '2024-09-30', format: 'date' })
  @IsOptional() @IsISO8601() endDate?: string;

  @ApiPropertyOptional({ example: 4, minimum: 1 })
  @IsOptional() @IsInt() @Min(1) teamSize?: number;

  @ApiProperty({
    example: ['NestJS', 'Next.js', 'PostgreSQL', 'Redis', 'WebSocket'],
    isArray: true,
    maxItems: 50,
  })
  @IsArray() @ArrayMaxSize(50) @IsString({ each: true })
  technologies: string[] = [];

  @ApiPropertyOptional({
    example:
      'Giảm 40% thời gian lên kế hoạch sprint; 500+ user active tháng đầu.',
  })
  @IsOptional() @IsString()
  results?: string;

  @ApiPropertyOptional({ type: RevenueDto })
  @IsOptional() @ValidateNested() @Type(() => RevenueDto)
  revenue?: RevenueDto;

  @ApiPropertyOptional({ example: 'Startup XYZ' })
  @IsOptional() @IsString() client?: string;

  @ApiPropertyOptional({ example: 'Tech Lead' })
  @IsOptional() @IsString() role?: string;

  @ApiPropertyOptional({ type: [LinkDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => LinkDto)
  links?: LinkDto[];

  @ApiPropertyOptional({ type: [MediaItemDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  gallery?: MediaItemDto[];

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional() @IsBoolean()
  isPublished?: boolean = false;
}
