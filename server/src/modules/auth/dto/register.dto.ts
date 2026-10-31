import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com', maxLength: 254 })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    example: 'alice',
    minLength: 3,
    maxLength: 32,
    description: 'Lowercase letters, digits, underscore, hyphen.',
  })
  @IsString()
  @Length(3, 32)
  @Matches(/^[a-z0-9][a-z0-9_-]{2,31}$/i, {
    message:
      'username must be 3–32 chars, start with alphanumeric, allow letters/digits/_/-',
  })
  username!: string;

  @ApiProperty({ example: 'Str0ng!Passw0rd', minLength: 8, maxLength: 128 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
