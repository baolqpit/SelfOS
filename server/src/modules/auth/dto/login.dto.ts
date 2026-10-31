import { IsString, Length, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(3, 254)
  emailOrUsername!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
