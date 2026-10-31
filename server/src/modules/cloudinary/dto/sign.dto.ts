import { IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class SignUploadDto {
  /**
   * Subfolder (inside the per-user root `selfos/{userId}`). Letters/digits/dashes only.
   */
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9/_-]{0,120}$/i, {
    message: 'folder must be alphanumeric with dashes/underscores/slashes',
  })
  folder?: string;

  @IsIn(['image', 'video', 'raw', 'auto'])
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image';
}
