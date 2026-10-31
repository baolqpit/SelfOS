import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpsertProfileDto {
  @ApiProperty({ example: 'Alice Nguyen', maxLength: 160 })
  @IsString() @MaxLength(160)
  fullName!: string;

  @ApiPropertyOptional({ example: '1998-04-23', format: 'date' })
  @IsOptional() @IsISO8601()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: '12 Nguyễn Huệ, Quận 1, TP. HCM' })
  @IsOptional() @IsString() @MaxLength(500)
  address?: string;

  @ApiProperty({ example: 'alice@example.com', maxLength: 254 })
  @IsEmail() @MaxLength(254)
  email!: string;

  @ApiPropertyOptional({ example: '+84 912 345 678' })
  @IsOptional() @IsString() @MaxLength(32)
  phone?: string;

  @ApiPropertyOptional({ example: 'Senior Full-stack Engineer' })
  @IsOptional() @IsString() @MaxLength(160)
  occupation?: string;

  @ApiPropertyOptional({
    example: 'Yêu thích TypeScript, cà phê đen và những buổi code đêm.',
  })
  @IsOptional() @IsString() @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/v1700000000/selfos/alice/avatar.jpg',
  })
  @IsOptional() @IsUrl() avatarUrl?: string;

  @ApiPropertyOptional({ example: 'selfos/alice/avatar' })
  @IsOptional() @IsString() avatarPublicId?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/v1700000000/selfos/alice/cover.jpg',
  })
  @IsOptional() @IsUrl() coverUrl?: string;

  @ApiPropertyOptional({ example: 'selfos/alice/cover' })
  @IsOptional() @IsString() coverPublicId?: string;

  @ApiPropertyOptional({
    example: {
      github: 'https://github.com/alice',
      linkedin: 'https://linkedin.com/in/alice',
      x: 'https://x.com/alice',
      website: 'https://alice.dev',
    },
    description: 'Map tự do của các social link.',
  })
  @IsOptional() @IsObject()
  socialLinks?: Record<string, string>;
}
