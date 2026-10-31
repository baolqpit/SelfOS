import type { MediaItem } from '@/types';

export interface SignResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
}

export interface UploadOptions {
  folder?: string;
  resourceType?: SignResponse['resourceType'];
  onProgress?: (percent: number) => void;
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  resource_type: 'image' | 'video' | 'raw';
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  original_filename?: string;
}

async function requestSignature(opts: UploadOptions): Promise<SignResponse> {
  const res = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      folder: opts.folder,
      resourceType: opts.resourceType ?? 'image',
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to sign upload: ${res.status} ${text}`);
  }
  return (await res.json()) as SignResponse;
}

export async function uploadToCloudinary(
  file: File,
  opts: UploadOptions = {},
): Promise<MediaItem> {
  const sig = await requestSignature(opts);

  const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);

  const data = await new Promise<CloudinaryUploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && opts.onProgress) {
        opts.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload network error'));
    xhr.send(form);
  });

  return {
    publicId: data.public_id,
    url: data.secure_url,
    type: data.resource_type,
    width: data.width,
    height: data.height,
    duration: data.duration,
    format: data.format,
    alt: data.original_filename,
  };
}

/** Build a transformed URL with f_auto, q_auto and optional width. */
export function cldUrl(src: string, width?: number): string {
  if (!src.includes('/upload/')) return src;
  const parts = ['f_auto', 'q_auto'];
  if (width) parts.push(`w_${width}`);
  return src.replace('/upload/', `/upload/${parts.join(',')}/`);
}
