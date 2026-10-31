# selfOS Server

Backend NestJS + PostgreSQL + Prisma theo `SPEC_SERVER.md`.

## Chạy local (không Docker)

```bash
cd server
cp .env .env.local      # (tùy chọn) chỉnh DATABASE_URL
npm install
# Khởi Postgres rời rồi:
npx prisma migrate dev --name init
npm run seed            # tạo user demo: demo@selfos.local / demo12345
npm run start:dev
```

API ở `http://localhost:4000/api/v1`. Swagger UI: `http://localhost:4000/docs`.

## Chạy bằng Docker

```bash
cd server
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run seed
```

## Lệnh thường dùng

| Lệnh | Mục đích |
|---|---|
| `npm run start:dev` | Chạy hot-reload |
| `npm run build && npm run start:prod` | Build + chạy production |
| `npm run prisma:migrate` | Tạo migration mới |
| `npm run prisma:deploy` | Áp migration production |
| `npm run prisma:studio` | Prisma Studio UI |
| `npm run seed` | Seed demo user |

## Endpoints (base `/api/v1`)

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- `GET/PUT /me/profile`, `GET /u/:username/profile`
- `GET/POST /me/projects`, `GET/PATCH/DELETE /me/projects/:id`
- `GET /u/:username/projects`, `GET /u/:username/projects/:slug`
- `GET/POST /me/daily`, `GET/PATCH/DELETE /me/daily/:id`
- `GET /u/:username/daily`, `GET /u/:username/daily/:slug`
- `GET/POST /me/knowledge`, `GET/PATCH/DELETE /me/knowledge/:id`
- `GET /u/:username/knowledge`, `GET /u/:username/knowledge/:slug`
- `GET/PUT /me/settings`, `GET /u/:username/settings/public`
- `POST /cloudinary/sign`
- `GET /health`

## Biến môi trường

Xem `.env` (đã có sẵn giá trị dev) và `.env.example`.
Nhớ:

1. Thay `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` bằng chuỗi random dài (`openssl rand -hex 48`).
2. Điền thông tin Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) nếu cần sign upload.
