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

export class CreateDailyDto {
  @IsString() @Length(2, 200)
  title!: string;

  @IsOptional() @IsString() @Length(2, 200)
  slug?: string;

  @IsObject()
  content!: Record<string, unknown>;

  @IsOptional() @IsString()
  contentHtml?: string;

  @IsOptional() @IsUrl() coverUrl?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  videos?: MediaItemDto[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  images?: MediaItemDto[];

  @IsArray() @ArrayMaxSize(50) @IsString({ each: true })
  tags: string[] = [];

  @IsOptional() @IsISO8601()
  publishedAt?: string;

  @IsOptional() @IsBoolean()
  isPublished?: boolean = false;
}
