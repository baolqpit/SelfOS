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

const SAMPLE_KNOWLEDGE_DOC = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Những điều học được' }],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Sử dụng ' },
                {
                  type: 'text',
                  marks: [{ type: 'code' }],
                  text: 'useOptimistic',
                },
                { type: 'text', text: ' cho pending UI.' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export class CreateKnowledgeDto {
  @ApiProperty({ example: 'React 19 Server Actions', maxLength: 200 })
  @IsString() @Length(2, 200)
  title!: string;

  @ApiPropertyOptional({ example: 'react-19-server-actions' })
  @IsOptional() @IsString() @Length(2, 200)
  slug?: string;

  @ApiProperty({
    description: 'Nội dung TipTap JSON.',
    example: SAMPLE_KNOWLEDGE_DOC,
  })
  @IsObject()
  content!: Record<string, unknown>;

  @ApiPropertyOptional({
    example:
      '<h3>Những điều học được</h3><ol><li>Sử dụng <code>useOptimistic</code> cho pending UI.</li></ol>',
  })
  @IsOptional() @IsString()
  contentHtml?: string;

  @ApiPropertyOptional({
    example: 'Feynman technique — đọc docs, tự giải thích, làm demo nhỏ.',
  })
  @IsOptional() @IsString()
  method?: string;

  @ApiPropertyOptional({ example: 'https://react.dev/reference/react' })
  @IsOptional() @IsString()
  source?: string;

  @ApiPropertyOptional({ example: '2024-09-10', format: 'date' })
  @IsOptional() @IsISO8601() startedAt?: string;

  @ApiPropertyOptional({ example: '2024-09-25', format: 'date' })
  @IsOptional() @IsISO8601() completedAt?: string;

  @ApiPropertyOptional({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1700000000/selfos/alice/certs/react19.pdf',
  })
  @IsOptional() @IsUrl() certificateUrl?: string;

  @ApiPropertyOptional({ example: 'selfos/alice/certs/react19' })
  @IsOptional() @IsString() certificatePublicId?: string;

  @ApiPropertyOptional({ type: [MediaItemDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  images?: MediaItemDto[];

  @ApiProperty({
    example: ['react', 'frontend', 'server-actions'],
    isArray: true,
    maxItems: 50,
  })
  @IsArray() @ArrayMaxSize(50) @IsString({ each: true })
  tags: string[] = [];

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional() @IsBoolean()
  isPublished?: boolean = false;
}
