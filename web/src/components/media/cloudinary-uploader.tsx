'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { MediaItem } from '@/types';
import { Button } from '@/components/ui/button';

interface Props {
  value?: MediaItem[];
  onChange: (next: MediaItem[]) => void;
  multiple?: boolean;
  accept?: string;
  folder?: string;
  resourceType?: 'image' | 'video' | 'auto';
  label?: string;
}

export function CloudinaryUploader({
  value = [],
  onChange,
  multiple = true,
  accept = 'image/*',
  folder,
  resourceType = 'image',
  label = 'Tải ảnh/video lên Cloudinary',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const uploaded: MediaItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        const effType = resourceType === 'auto' ? type : resourceType;
        const item = await uploadToCloudinary(file, {
          folder,
          resourceType: effType,
          onProgress: setProgress,
        });
        uploaded.push(item);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed');
      }
    }
    setProgress(null);
    onChange(multiple ? [...value, ...uploaded] : uploaded.slice(-1));
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--color-border)] p-6 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]/40"
      >
        <Upload size={18} />
        <span>{label}</span>
        <span className="text-xs">Kéo thả hoặc bấm để chọn</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {progress !== null && (
        <div className="h-1.5 w-full overflow-hidden rounded bg-[var(--color-muted)]">
          <div
            className="h-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <p className="text-xs text-[var(--color-destructive)]">{error}</p>}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {value.map((m, i) => (
            <div key={m.publicId + i} className="relative aspect-square overflow-hidden rounded border border-[var(--color-border)]">
              {m.type === 'video' ? (
                <video src={m.url} className="h-full w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.alt ?? ''} className="h-full w-full object-cover" />
              )}
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => removeAt(i)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
