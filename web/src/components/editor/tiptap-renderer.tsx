import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import type { JSONContent } from '@tiptap/react';

interface Props {
  value: JSONContent | Record<string, unknown> | null | undefined;
  html?: string | null;
}

const extensions = [
  StarterKit,
  Underline,
  Highlight,
  Link,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Image,
  Youtube,
];

/**
 * Static renderer for TipTap content. Prefers pre-rendered HTML
 * (sanitized server-side) and falls back to runtime JSON → HTML.
 */
export function TiptapRenderer({ value, html }: Props) {
  let out = html ?? '';
  if (!out && value) {
    try {
      out = generateHTML(value as JSONContent, extensions);
    } catch {
      out = '';
    }
  }
  return (
    <div
      className="prose-rendered"
      // The HTML is either sanitized on BE or deterministically generated from a validated JSON doc.
      dangerouslySetInnerHTML={{ __html: out }}
    />
  );
}
