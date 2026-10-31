import Image from 'next/image';
import { cldUrl } from '@/lib/cloudinary';

interface Props {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function CloudinaryImage({ src, alt = '', width = 1200, height = 800, className, priority }: Props) {
  if (!src) return null;
  return (
    <Image
      src={cldUrl(src, width)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}
