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

export class CreateProjectDto {
  @IsString() @Length(2, 160)
  name!: string;

  @IsOptional() @IsString() @Length(2, 200)
  slug?: string;

  @IsOptional() @IsString() @MaxLength(500)
  summary?: string;

  @IsObject()
  content!: Record<string, unknown>;

  @IsOptional() @IsString()
  contentHtml?: string;

  @IsOptional() @IsUrl() coverUrl?: string;
  @IsOptional() @IsString() coverPublicId?: string;

  @IsOptional() @IsISO8601() startDate?: string;
  @IsOptional() @IsISO8601() endDate?: string;

  @IsOptional() @IsInt() @Min(1) teamSize?: number;

  @IsArray() @ArrayMaxSize(50) @IsString({ each: true })
  technologies: string[] = [];

  @IsOptional() @IsString()
  results?: string;

  @IsOptional() @ValidateNested() @Type(() => RevenueDto)
  revenue?: RevenueDto;

  @IsOptional() @IsString() client?: string;
  @IsOptional() @IsString() role?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => LinkDto)
  links?: LinkDto[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MediaItemDto)
  gallery?: MediaItemDto[];

  @IsOptional() @IsBoolean()
  isPublished?: boolean = false;
}
