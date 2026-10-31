import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'Email hoặc username đã đăng ký.',
  })
  @IsString()
  @Length(3, 254)
  emailOrUsername!: string;

  @ApiProperty({ example: 'Str0ng!Passw0rd' })
  @IsString()
  @MinLength(8)
  password!: string;
}
