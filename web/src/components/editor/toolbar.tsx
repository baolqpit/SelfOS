'use client';

import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Youtube,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  editor: Editor | null;
  onInsertImage: () => void;
}

function Btn({
  active,
  onClick,
  disabled,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition',
        active
          ? 'bg-[var(--color-primary)]/20 text-[var(--color-foreground)]'
          : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor, onInsertImage }: Props) {
  if (!editor) return null;

  const promptLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  };

  const promptYoutube = () => {
    const url = window.prompt('YouTube URL');
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-[var(--color-border)] p-2">
      <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={16} />
      </Btn>
      <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={16} />
      </Btn>
      <div className="mx-1 w-px bg-[var(--color-border)]" />
      <Btn
        title="H1"
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </Btn>
      <Btn
        title="H2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </Btn>
      <Btn
        title="H3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </Btn>
      <div className="mx-1 w-px bg-[var(--color-border)]" />
      <Btn
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Btn>
      <Btn
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Btn>
      <Btn
        title="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </Btn>
      <Btn
        title="Strike"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </Btn>
      <div className="mx-1 w-px bg-[var(--color-border)]" />
      <Btn
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Btn>
      <Btn
        title="Ordered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </Btn>
      <Btn
        title="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </Btn>
      <Btn
        title="Code block"
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code size={16} />
      </Btn>
      <div className="mx-1 w-px bg-[var(--color-border)]" />
      <Btn
        title="Align left"
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft size={16} />
      </Btn>
      <Btn
        title="Align center"
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter size={16} />
      </Btn>
      <Btn
        title="Align right"
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight size={16} />
      </Btn>
      <div className="mx-1 w-px bg-[var(--color-border)]" />
      <Btn title="Insert link" active={editor.isActive('link')} onClick={promptLink}>
        <LinkIcon size={16} />
      </Btn>
      <Btn title="Insert image (Cloudinary)" onClick={onInsertImage}>
        <ImageIcon size={16} />
      </Btn>
      <Btn title="Insert YouTube" onClick={promptYoutube}>
        <Youtube size={16} />
      </Btn>
    </div>
  );
}
