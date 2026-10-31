import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

const SAMPLE_MODULES_VISIBILITY = {
  profile: {
    visible: true,
    fields: {
      fullName: true,
      email: true,
      phone: false,
      address: false,
      dateOfBirth: false,
      occupation: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      socialLinks: true,
    },
  },
  projects: { visible: true, showRevenue: false, showClient: true },
  daily: { visible: true },
  knowledge: { visible: true, showCertificates: true },
};

export class UpdateSettingsDto {
  @ApiPropertyOptional({
    example: 'system',
    enum: ['light', 'dark', 'system'],
    description: 'Hoặc một key theme tùy chỉnh.',
  })
  @IsOptional() @IsString()
  theme?: string;

  @ApiPropertyOptional({ example: '#6366F1' })
  @IsOptional() @IsHexColor()
  accentColor?: string;

  @ApiPropertyOptional({ example: 'grid', enum: ['grid', 'list', 'magazine'] })
  @IsOptional() @IsIn(['grid', 'list', 'magazine'])
  layout?: 'grid' | 'list' | 'magazine';

  @ApiPropertyOptional({
    description: 'Bật/tắt từng module & từng field public.',
    example: SAMPLE_MODULES_VISIBILITY,
  })
  @IsOptional() @IsObject()
  modulesVisibility?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: {
      title: 'Alice Nguyen — Full-stack Engineer',
      description: 'Portfolio của Alice: dự án, nhật ký, kiến thức đã học.',
      ogImageUrl:
        'https://res.cloudinary.com/demo/image/upload/v1700000000/selfos/alice/og.jpg',
    },
  })
  @IsOptional() @IsObject()
  seo?: { title?: string; description?: string; ogImageUrl?: string };

  @ApiPropertyOptional({ example: 'alice.dev' })
  @IsOptional() @IsString()
  customDomain?: string;
}
