import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface SignResult {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
}

@Injectable()
export class CloudinaryService {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly uploadRoot: string;

  constructor(cfg: ConfigService) {
    this.cloudName = cfg.get<string>('cloudinary.cloudName') ?? '';
    this.apiKey = cfg.get<string>('cloudinary.apiKey') ?? '';
    this.apiSecret = cfg.get<string>('cloudinary.apiSecret') ?? '';
    this.uploadRoot = cfg.get<string>('cloudinary.uploadFolder') ?? 'selfos';
  }

  sign(
    userId: string,
    folder: string | undefined,
    resourceType: SignResult['resourceType'],
  ): SignResult {
    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new ServiceUnavailableException('Cloudinary is not configured');
    }
    const safeSub = (folder ?? '').replace(/^\/+|\/+$/g, '');
    const scoped = [this.uploadRoot, userId, safeSub]
      .filter(Boolean)
      .join('/');
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { folder: scoped, timestamp },
      this.apiSecret,
    );
    return {
      timestamp,
      signature,
      apiKey: this.apiKey,
      cloudName: this.cloudName,
      folder: scoped,
      resourceType,
    };
  }
}
