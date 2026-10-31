'use client';

import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { useRef, useState } from 'react';
import { EditorToolbar } from './toolbar';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface Props {
  value: JSONContent;
  onChange: (json: JSONContent, html: string) => void;
  placeholder?: string;
  folder?: string;
}

export function TiptapEditor({ value, onChange, placeholder, folder }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { HTMLAttributes: { class: 'hljs' } } }),
      Underline,
      Highlight,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Viết nội dung…' }),
      Image.configure({ inline: false, HTMLAttributes: { loading: 'lazy' } }),
      Youtube.configure({ controls: true, nocookie: true }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON(), editor.getHTML());
    },
  });

  const handleImageInsert = () => fileInput.current?.click();

  const onFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      setUploading(true);
      const isVideo = file.type.startsWith('video/');
      const media = await uploadToCloudinary(file, {
        folder,
        resourceType: isVideo ? 'video' : 'image',
      });
      if (isVideo) {
        editor
          .chain()
          .focus()
          .insertContent(
            `<video src="${media.url}" controls preload="metadata" width="${media.width ?? 640}"></video>`,
          )
          .run();
      } else {
        editor.chain().focus().setImage({ src: media.url, alt: media.alt ?? '' }).run();
      }
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)]">
      <EditorToolbar editor={editor} onInsertImage={handleImageInsert} />
      <input
        ref={fileInput}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={onFileChosen}
      />
      <div className="relative px-3">
        {uploading && (
          <div className="pointer-events-none absolute right-2 top-2 rounded bg-[var(--color-muted)] px-2 py-1 text-xs">
            Đang tải lên…
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
