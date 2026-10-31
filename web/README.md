# selfOS Web (Next.js 15)

Frontend theo `SPEC_UI.md`. Backend: NestJS (`../server/`).

## Chạy local

```bash
cd web
npm install            # (xem lưu ý về cache ở README gốc)
# đảm bảo BE đang chạy ở http://localhost:4000
cp .env.local .env.local.backup   # (tùy chọn)
# chỉnh .env.local nếu đổi API URL / cloudinary
npm run dev
```

Web ở `http://localhost:3000`.

## Routes

- `/` – Landing
- `/login`, `/register` – Auth
- `/dashboard`, `/dashboard/profile`, `/dashboard/projects`, `/dashboard/daily`, `/dashboard/knowledge`, `/dashboard/settings` – Admin (yêu cầu đăng nhập; middleware guard)
- `/u/[username]` – Trang public user
- `/u/[username]/projects` + `[slug]`
- `/u/[username]/daily` + `[slug]`
- `/u/[username]/knowledge` + `[slug]`

## Môi trường (`.env.local`)

| Biến | Mô tả |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base của NestJS BE (mặc định `http://localhost:4000/api/v1`) |
| `NEXTAUTH_URL` | URL public của frontend |
| `AUTH_SECRET` | Chuỗi bí mật mã hóa session cookie (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name từ Cloudinary |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | (không bắt buộc ở FE — BE ký upload. Có thể để trống) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER` | Thư mục gốc trên Cloudinary |

**Ghi chú:** Việc ký request upload Cloudinary được uỷ quyền cho BE (xem `src/app/api/cloudinary/sign/route.ts`), nên FE không cần `CLOUDINARY_API_SECRET`.

## Deploy Vercel

- Project root: `web/`.
- Framework preset: Next.js.
- Env vars: điền đầy đủ `NEXT_PUBLIC_API_BASE_URL`, `NEXTAUTH_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER`.
- Hình ảnh Cloudinary đã được allow trong `next.config.ts`.

## Tech

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 (PostCSS plugin)
- NextAuth v5 (Credentials → BE JWT)
- TanStack Query (client), ky (HTTP)
- TipTap v2 editor + renderer
- Cloudinary signed upload trực tiếp từ client (sig lấy từ BE qua Next route)
- Lucide icons, react-hook-form, zod
