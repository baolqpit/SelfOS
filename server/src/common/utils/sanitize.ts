import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize HTML coming from TipTap editor on the client.
 * Keeps media + formatting tags needed by the renderer.
 */
export function sanitizeRichHtml(html: string | undefined | null): string | null {
  if (!html) return null;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'video',
      'source',
      'iframe',
      'figure',
      'figcaption',
      'h1',
      'h2',
      'span',
    ]),
    allowedAttributes: {
      '*': ['class', 'style', 'id'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      video: ['src', 'controls', 'poster', 'width', 'height', 'preload'],
      source: ['src', 'type'],
      iframe: [
        'src',
        'allow',
        'allowfullscreen',
        'frameborder',
        'width',
        'height',
      ],
    },
    allowedSchemes: ['http', 'https', 'data', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowedIframeHostnames: [
      'www.youtube.com',
      'youtube.com',
      'player.vimeo.com',
      'player.cloudinary.com',
    ],
  });
}
