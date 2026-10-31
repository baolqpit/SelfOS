import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHkxYWJjZCIsImlhdCI6MTcxMjM0NTY3OCwiZXhwIjoxNzE0OTM3Njc4fQ.signature',
    description: 'Refresh token nhận từ /auth/login.',
  })
  @IsJWT()
  refreshToken!: string;
}
