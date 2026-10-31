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
  @IsString() @MaxLength(160)
  fullName!: string;

  @IsOptional() @IsISO8601()
  dateOfBirth?: string;

  @IsOptional() @IsString() @MaxLength(500)
  address?: string;

  @IsEmail() @MaxLength(254)
  email!: string;

  @IsOptional() @IsString() @MaxLength(32)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(160)
  occupation?: string;

  @IsOptional() @IsString() @MaxLength(500)
  bio?: string;

  @IsOptional() @IsUrl() avatarUrl?: string;
  @IsOptional() @IsString() avatarPublicId?: string;
  @IsOptional() @IsUrl() coverUrl?: string;
  @IsOptional() @IsString() coverPublicId?: string;

  @IsOptional() @IsObject()
  socialLinks?: Record<string, string>;
}
