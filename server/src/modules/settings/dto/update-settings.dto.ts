import { IsHexColor, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional() @IsString()
  theme?: string;

  @IsOptional() @IsHexColor()
  accentColor?: string;

  @IsOptional() @IsIn(['grid', 'list', 'magazine'])
  layout?: 'grid' | 'list' | 'magazine';

  @IsOptional() @IsObject()
  modulesVisibility?: Record<string, unknown>;

  @IsOptional() @IsObject()
  seo?: { title?: string; description?: string; ogImageUrl?: string };

  @IsOptional() @IsString()
  customDomain?: string;
}
