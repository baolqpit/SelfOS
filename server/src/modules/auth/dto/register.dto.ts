import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @Length(3, 32)
  @Matches(/^[a-z0-9][a-z0-9_-]{2,31}$/i, {
    message:
      'username must be 3–32 chars, start with alphanumeric, allow letters/digits/_/-',
  })
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
