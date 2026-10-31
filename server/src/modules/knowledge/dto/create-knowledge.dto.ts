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

export class CreateKnowledgeDto {
  @IsString() @Length(2, 200)
  title!: string;

  @IsOptional() @IsString() @Length(2, 200)
  slug?: string;

  @IsObject()
  content!: Record<string, unknown>;

  @IsOptional() @IsString()
  contentHtml?: string;

  @IsOptional() @IsString()
  method?: string;

  @IsOptional() @IsString()
  source?: string;

  @IsOptional() @IsISO8601() startedAt?: string;
  @IsOptional() @IsISO8601() completedAt?: string;

  @IsOptional() @IsUrl() certificateUrl?: string;
  @IsOptional() @IsString() certificatePublicId?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  images?: MediaItemDto[];

  @IsArray() @ArrayMaxSize(50) @IsString({ each: true })
  tags: string[] = [];

  @IsOptional() @IsBoolean()
  isPublished?: boolean = false;
}
