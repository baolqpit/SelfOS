import { Type } from 'class-transformer';
import { IsBooleanString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  pageSize: number = 20;

  @IsOptional() @IsString()
  q?: string;

  @IsOptional() @IsBooleanString()
  isPublished?: string;
}
