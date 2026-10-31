import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 120_000_000, minimum: 0 })
  @IsNumber() @Min(0) @Type(() => Number)
  amount!: number;

  @ApiProperty({ example: 'VND', description: 'Mã tiền tệ ISO 4217.' })
  @IsString()
  currency!: string;
}

export class LinkDto {
  @ApiProperty({ example: 'Live demo' })
  @IsString() label!: string;

  @ApiProperty({ example: 'https://demo.alice.dev' })
  @IsUrl() url!: string;
}

export class MediaItemDto {
  @ApiProperty({ example: 'selfos/alice/projects/cover-1' })
  @IsString() publicId!: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1700000000/selfos/alice/projects/cover-1.jpg',
  })
  @IsUrl() url!: string;

  @ApiProperty({ enum: ['image', 'video', 'raw'], example: 'image' })
  @IsIn(['image', 'video', 'raw']) type!: 'image' | 'video' | 'raw';

  @ApiPropertyOptional({ example: 1600 })
  @IsOptional() @IsInt() width?: number;

  @ApiPropertyOptional({ example: 900 })
  @IsOptional() @IsInt() height?: number;

  @ApiPropertyOptional({ example: 42.5, description: 'Chỉ cho video (giây).' })
  @IsOptional() @IsNumber() duration?: number;

  @ApiPropertyOptional({ example: 'jpg' })
  @IsOptional() @IsString() format?: string;

  @ApiPropertyOptional({ example: 'Ảnh demo trang chủ sản phẩm' })
  @IsOptional() @IsString() alt?: string;
}
