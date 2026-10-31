import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class RevenueDto {
  @IsNumber() @Min(0) @Type(() => Number)
  amount!: number;

  @IsString()
  currency!: string;
}

export class LinkDto {
  @IsString() label!: string;
  @IsUrl() url!: string;
}

export class MediaItemDto {
  @IsString() publicId!: string;
  @IsUrl() url!: string;
  @IsIn(['image', 'video', 'raw']) type!: 'image' | 'video' | 'raw';
  @IsOptional() @IsInt() width?: number;
  @IsOptional() @IsInt() height?: number;
  @IsOptional() @IsNumber() duration?: number;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsString() alt?: string;
}
