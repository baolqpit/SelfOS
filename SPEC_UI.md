# selfOS — UI Specification (Next.js + Cloudinary)

> Spec triển khai phía **Website UI** cho hệ thống selfOS (portfolio cá nhân đa người dùng).
> Deploy: **Vercel**. Media host: **Cloudinary**. BE: NestJS (xem `SPEC_SERVER.md`).

---

## 1. Mục tiêu & phạm vi

Website cho phép **nhiều user** đăng ký / đăng nhập để tạo "trang cá nhân" (giống portfolio + blog) với các module:

1. **Profile** — thông tin cá nhân.
2. **Projects** — dự án đã làm.
3. **Daily Vlog** — nhật ký/vlog.
4. **Knowledge** — kiến thức đã học, chứng chỉ.

Hai chế độ sử dụng:

- **Admin / Owner mode** (đã đăng nhập): CRUD toàn bộ dữ liệu của chính mình, cấu hình Settings hiển thị.
- **Viewer mode** (public, không cần đăng nhập): xem thông tin của user khác qua URL public `/{username}`.

---

## 2. Công nghệ

| Hạng mục | Lựa chọn |
|---|---|
| Framework | **Next.js 15 (App Router)** + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix |
| State / Data | TanStack Query (server state), Zustand (UI state nhẹ) |
| Form | React Hook Form + Zod |
| Rich Text Editor | **TipTap v2** (ProseMirror) — hỗ trợ bold/italic/heading/list/link/image/video/code block/embed, tương đương Gutenberg (WordPress) |
| Media | **Cloudinary** (upload trực tiếp từ client qua signed upload preset) |
| Auth client | NextAuth.js v5 (Auth.js) với Credentials provider gọi BE, lưu JWT trong httpOnly cookie |
| HTTP client | `fetch` + `ky` wrapper (interceptor gắn Bearer) |
| i18n | `next-intl` (vi mặc định, en tùy chọn) |
| SEO | Next.js metadata API + OpenGraph động |
| Deploy | Vercel |

---

## 3. Cấu trúc thư mục đề xuất

```
web/
├─ src/
│  ├─ app/
│  │  ├─ (public)/                     # Viewer – không cần auth
│  │  │  ├─ page.tsx                   # Landing
│  │  │  ├─ u/[username]/
│  │  │  │  ├─ page.tsx                # Trang profile public
│  │  │  │  ├─ projects/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [slug]/page.tsx
│  │  │  │  ├─ daily/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [slug]/page.tsx
│  │  │  │  └─ knowledge/
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ [slug]/page.tsx
│  │  │  └─ (auth)/
│  │  │     ├─ login/page.tsx
│  │  │     └─ register/page.tsx
│  │  ├─ (dashboard)/                  # Admin – yêu cầu đăng nhập
│  │  │  ├─ layout.tsx                 # Sidebar + guard
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ profile/page.tsx
│  │  │  ├─ projects/
│  │  │  │  ├─ page.tsx                # list
│  │  │  │  ├─ new/page.tsx
│  │  │  │  └─ [id]/edit/page.tsx
│  │  │  ├─ daily/…
│  │  │  ├─ knowledge/…
│  │  │  └─ settings/page.tsx
│  │  ├─ api/
│  │  │  ├─ auth/[...nextauth]/route.ts
│  │  │  └─ cloudinary/sign/route.ts   # Ký request upload
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ ui/                           # shadcn
│  │  ├─ editor/                       # TipTap wrapper + toolbar + image/video node
│  │  ├─ media/                        # CloudinaryUploader, ImageWithBlur, VideoPlayer
│  │  ├─ layout/                       # Navbar, Sidebar, Footer, ThemeToggle
│  │  └─ modules/
│  │     ├─ profile/
│  │     ├─ projects/
│  │     ├─ daily/
│  │     └─ knowledge/
│  ├─ lib/
│  │  ├─ api.ts                        # ky instance
│  │  ├─ auth.ts                       # authOptions
│  │  ├─ cloudinary.ts                 # client helpers
│  │  ├─ validators/                   # Zod schemas (dùng chung với BE DTO shape)
│  │  └─ utils.ts
│  ├─ hooks/
│  ├─ types/
│  └─ middleware.ts                    # Bảo vệ /(dashboard)/*
├─ public/
├─ .env.local.example
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 4. Routing & phân quyền

| Route | Auth | Mục đích |
|---|---|---|
| `/` | public | Landing + CTA đăng nhập/đăng ký |
| `/login`, `/register` | public | Auth form |
| `/u/[username]` | public | Trang profile viewer |
| `/u/[username]/projects` | public | List projects public |
| `/u/[username]/projects/[slug]` | public | Chi tiết project |
| `/u/[username]/daily` + `[slug]` | public | Vlog |
| `/u/[username]/knowledge` + `[slug]` | public | Knowledge |
| `/dashboard` | **auth** | Trang tổng quan của chính user |
| `/dashboard/profile` | auth | Sửa profile |
| `/dashboard/projects` | auth | CRUD projects |
| `/dashboard/daily` | auth | CRUD daily |
| `/dashboard/knowledge` | auth | CRUD knowledge |
| `/dashboard/settings` | auth | Cấu hình hiển thị (xem §9) |

`middleware.ts` chặn mọi path `/(dashboard)/*` nếu không có session cookie → redirect `/login?next=…`.

---

## 5. Data model phía client (mirror BE)

```ts
// types/index.ts
export type ID = string;

export interface User {
  id: ID;
  username: string;      // slug duy nhất, dùng cho URL public
  email: string;
  createdAt: string;
}

export interface Profile {
  userId: ID;
  fullName: string;
  dateOfBirth?: string;        // ISO
  address?: string;
  email: string;
  phone?: string;
  occupation?: string;
  bio?: string;                // short tagline
  avatarUrl?: string;          // Cloudinary secure_url
  coverUrl?: string;
  socialLinks?: {              // free-form, type-safe keys phổ biến
    github?: string; linkedin?: string; facebook?: string;
    x?: string; youtube?: string; website?: string;
    [k: string]: string | undefined;
  };
}

export interface Project {
  id: ID;
  userId: ID;
  slug: string;
  name: string;
  summary?: string;             // mô tả ngắn hiển thị card
  content: RichText;            // TipTap JSON – body dài
  coverUrl?: string;
  startDate?: string;
  endDate?: string;
  teamSize?: number;
  technologies: string[];       // tags
  results?: string;             // kết quả đạt được (text ngắn)
  revenue?: {                   // doanh thu (tùy chọn)
    amount: number;
    currency: string;           // 'VND' | 'USD' | ...
  };
  client?: string;
  role?: string;                // vai trò bản thân trong dự án
  links?: { label: string; url: string }[];
  gallery?: MediaItem[];        // ảnh/video phụ ngoài content
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyVlog {
  id: ID;
  userId: ID;
  slug: string;
  title: string;
  content: RichText;
  coverUrl?: string;
  videos: MediaItem[];
  images: MediaItem[];
  publishedAt?: string;
  tags: string[];
  isPublished: boolean;
}

export interface Knowledge {
  id: ID;
  userId: ID;
  slug: string;
  title: string;
  content: RichText;
  method?: string;              // phương pháp học
  source?: string;              // nguồn/khóa học
  startedAt?: string;
  completedAt?: string;
  certificateUrl?: string;      // Cloudinary (image/pdf)
  images: MediaItem[];
  tags: string[];
  isPublished: boolean;
}

export interface MediaItem {
  publicId: string;             // Cloudinary public_id
  url: string;                  // secure_url
  type: 'image' | 'video' | 'raw';
  width?: number; height?: number; duration?: number;
  format?: string;
  alt?: string;
}

/** TipTap JSON document */
export type RichText = { type: 'doc'; content: unknown[] };
```

---

## 6. Rich Text Editor (TipTap)

Mục tiêu: trải nghiệm giống WordPress block editor.

**Extensions tối thiểu:**

- StarterKit (bold/italic/strike/heading/paragraph/list/blockquote/codeblock/history/hardbreak)
- Underline, Highlight, TextAlign, Link (có target), Placeholder
- Image (custom node – lưu `publicId`, `url`, `width`, `height`, caption, alignment)
- Video (custom node – render `<video>` hoặc Cloudinary player)
- YouTube/Vimeo embed (via `@tiptap/extension-youtube`)
- Code block + lowlight (syntax highlight)
- Table (optional)
- Horizontal rule

**Toolbar:** nhóm Format / Heading / List / Alignment / Insert (Image, Video, Embed, Link, Table) / Undo-Redo.

**Lưu trữ:** gửi `content: RichText` (JSON) lên BE. Khi render public dùng component `<TiptapRenderer value={content} />` (read-only, no editor runtime nếu có thể – prefer static HTML cho SEO: lưu kèm `contentHtml` phục vụ server render).

**Upload trong editor:** nhấn chèn ảnh/video → mở `CloudinaryUploader` → nhận `MediaItem` → chèn vào document.

---

## 7. Tích hợp Cloudinary

**Chiến lược:** signed upload từ client để không lộ API secret.

- `.env.local`:
  ```
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER=selfos
  ```
- API route `/api/cloudinary/sign` nhận `{folder, resource_type}` → trả `{timestamp, signature, apiKey, cloudName, folder}` (yêu cầu session hợp lệ).
- Component `CloudinaryUploader`:
  - Dùng `fetch` POST tới `https://api.cloudinary.com/v1_1/{cloud}/{image|video|auto}/upload` kèm signature.
  - Hiển thị progress, nhiều file, drag-drop.
  - Trả về mảng `MediaItem` → caller lưu vào form.
- Hiển thị:
  - Ảnh: `next/image` với loader Cloudinary (resize `w_,q_auto,f_auto`).
  - Video: dùng `<video controls preload="metadata">` hoặc `cloudinary-video-player` (nếu cần adaptive streaming).

**Giới hạn & an toàn:** validate ở `/api/cloudinary/sign` (max size, resource_type whitelist), đặt eager transforms chuẩn (thumb 400 / 800 / 1600).

---

## 8. Auth flow

- Register: form (email, username, password, confirm) → POST `/{BE}/auth/register` → auto login.
- Login: NextAuth Credentials provider → POST `/{BE}/auth/login` → BE trả `{accessToken, refreshToken, user}` → lưu trong session (httpOnly cookie, encrypt bằng `AUTH_SECRET`).
- Request có auth: `lib/api.ts` đọc token từ `getServerSession` (server component) hoặc từ `useSession` (client) gắn `Authorization: Bearer`.
- Refresh: khi 401, interceptor gọi `/auth/refresh`; nếu fail → `signOut()`.
- Logout: `signOut({ callbackUrl: '/' })` + optionally POST `/auth/logout`.

---

## 9. Settings page

`/dashboard/settings` cho phép user điều khiển **cái gì được hiển thị public** trong `/u/[username]`:

```ts
interface DisplaySettings {
  theme: 'light' | 'dark' | 'system' | string;    // key theme
  accentColor?: string;                            // hex
  layout: 'grid' | 'list' | 'magazine';
  modulesVisibility: {
    profile:   { visible: boolean; fields: Partial<Record<keyof Profile, boolean>> };
    projects:  { visible: boolean; showRevenue: boolean; showClient: boolean };
    daily:     { visible: boolean };
    knowledge: { visible: boolean; showCertificates: boolean };
  };
  seo: { title?: string; description?: string; ogImageUrl?: string };
  customDomain?: string;    // tương lai
}
```

Lưu trong bảng `settings` (một bản ghi / user). Trang viewer đọc settings để quyết định render.

---

## 10. Luồng CRUD mẫu — Project

1. `/dashboard/projects` — table (TanStack Table) hiển thị list, có filter theo `isPublished`, search theo tên.
2. Nút **New** → `/dashboard/projects/new`:
   - Section 1: Info (name, slug auto, summary, dates, teamSize, role, client, revenue).
   - Section 2: Tech stack (TagInput).
   - Section 3: Media (CoverUploader + Gallery).
   - Section 4: Content (TipTap).
   - Section 5: Publish toggle.
   - Submit → `POST /projects`.
3. `/dashboard/projects/[id]/edit`: tương tự, prefetch bằng `generateMetadata` + TanStack Query.
4. Delete: dialog xác nhận → `DELETE /projects/:id`.

Áp dụng tương tự cho Daily & Knowledge.

---

## 11. Trang viewer `/u/[username]`

- SSR + ISR (revalidate 60s) qua `generateStaticParams` + `revalidateTag` khi user cập nhật.
- Header: avatar/cover, tên, bio, social links.
- Tabs/sections: Projects / Daily / Knowledge — tôn trọng `DisplaySettings.modulesVisibility`.
- Mỗi item có trang chi tiết riêng (`[slug]`) render `contentHtml` (TipTap → HTML) để tối ưu SEO.
- `generateMetadata` sinh OpenGraph: title = `${fullName} — ${module}`, image = cover.

---

## 12. Môi trường & Deploy (Vercel)

**`.env.local.example`**:
```
NEXT_PUBLIC_API_BASE_URL=https://api.selfos.app
NEXTAUTH_URL=https://selfos.app
AUTH_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER=selfos
```

**Vercel:**
- Project root = `web/`.
- Framework preset: Next.js.
- Env vars: khai báo đủ set trên.
- Preview deployments cho mỗi PR.
- Image domains: thêm `res.cloudinary.com` vào `next.config.ts`.
- Edge runtime cho `middleware.ts`, các API route khác dùng Node runtime.

---

## 13. Chất lượng & công cụ

- ESLint (next/core-web-vitals) + Prettier + TypeScript strict.
- Husky + lint-staged (pre-commit).
- Playwright (E2E cơ bản: register → login → tạo project → view public).
- Vitest/Jest cho util & component logic.
- Sentry (tùy chọn) phía client.

---

## 14. Roadmap triển khai gợi ý

1. Khởi tạo Next.js, Tailwind, shadcn, cấu trúc thư mục.
2. Auth (NextAuth + BE endpoints) + middleware guard.
3. Dashboard layout + Profile CRUD + Cloudinary upload.
4. TipTap editor + renderer (JSON + HTML).
5. Projects → Daily → Knowledge CRUD.
6. Settings & Viewer page `/u/[username]`.
7. SEO, ISR, polish, deploy Vercel.
