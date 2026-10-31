# selfOS — Server Specification (NestJS + PostgreSQL + Docker)

> Spec triển khai phía **Backend** cho hệ thống selfOS.
> UI: Next.js (xem `SPEC_UI.md`). Media host: Cloudinary (lưu URL/publicId, không stream qua BE).

---

## 1. Mục tiêu

Cung cấp REST API đa người dùng cho 4 module Profile / Projects / Daily / Knowledge, kèm Auth JWT, Settings, và endpoint ký upload Cloudinary.

---

## 2. Công nghệ

| Hạng mục | Lựa chọn |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | **NestJS 10** (modular, DI, Guard, Interceptor) |
| Ngôn ngữ | TypeScript strict |
| DB | **PostgreSQL 16** |
| ORM | **Prisma 5** (migration + type-safe) |
| Auth | JWT (access + refresh), Argon2 hash password |
| Validation | class-validator + class-transformer |
| Doc | Swagger / OpenAPI (`@nestjs/swagger`) |
| Config | `@nestjs/config` + Zod schema validate `.env` |
| Logging | Pino (`nestjs-pino`) |
| Rate limit | `@nestjs/throttler` |
| Testing | Jest (unit) + Supertest (e2e) |
| Container | Docker + docker-compose |
| CI | GitHub Actions (lint → test → build image) |

---

## 3. Cấu trúc thư mục (sẽ nằm trong repo hiện tại ở `server/`)

```
server/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ common/
│  │  ├─ decorators/ (CurrentUser, Public, …)
│  │  ├─ guards/     (JwtAuthGuard, OwnershipGuard)
│  │  ├─ filters/    (AllExceptionsFilter)
│  │  ├─ interceptors/ (TransformInterceptor, LoggingInterceptor)
│  │  ├─ pipes/
│  │  └─ utils/
│  ├─ config/
│  │  ├─ env.validation.ts
│  │  └─ configuration.ts
│  ├─ prisma/
│  │  └─ prisma.service.ts
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ dto/ (RegisterDto, LoginDto, RefreshDto)
│  │  │  └─ strategies/ (jwt.strategy.ts, jwt-refresh.strategy.ts)
│  │  ├─ users/
│  │  ├─ profile/
│  │  ├─ projects/
│  │  ├─ daily/
│  │  ├─ knowledge/
│  │  ├─ settings/
│  │  └─ cloudinary/
│  │     ├─ cloudinary.controller.ts     # /cloudinary/sign
│  │     └─ cloudinary.service.ts
│  └─ health/health.controller.ts
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
├─ test/
├─ Dockerfile
├─ docker-compose.yml
├─ .env.example
├─ nest-cli.json
├─ tsconfig.json
└─ package.json
```

---

## 4. Database schema (Prisma)

```prisma
// prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db     { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  username      String   @unique                    // dùng cho /u/{username}
  passwordHash  String
  emailVerified DateTime?
  profile       Profile?
  settings      Settings?
  projects      Project[]
  daily         DailyVlog[]
  knowledge     Knowledge[]
  refreshTokens RefreshToken[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String
  expiresAt DateTime
  revokedAt DateTime?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

model Profile {
  userId        String   @id
  fullName      String
  dateOfBirth   DateTime?
  address       String?
  email         String                   // email hiển thị (có thể khác email login)
  phone         String?
  occupation    String?
  bio           String?
  avatarUrl     String?
  avatarPublicId String?
  coverUrl      String?
  coverPublicId String?
  socialLinks   Json?                    // {github, linkedin, …}
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  updatedAt     DateTime @updatedAt
}

model Project {
  id            String   @id @default(cuid())
  userId        String
  slug          String
  name          String
  summary       String?
  content       Json                     // TipTap JSON
  contentHtml   String?                  // HTML render cho SEO
  coverUrl      String?
  coverPublicId String?
  startDate     DateTime?
  endDate       DateTime?
  teamSize      Int?
  technologies  String[]
  results       String?
  revenueAmount Decimal?  @db.Decimal(14,2)
  revenueCurrency String?
  client        String?
  role          String?
  links         Json?                    // [{label,url}]
  gallery       Json?                    // MediaItem[]
  isPublished   Boolean   @default(false)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, slug])
  @@index([userId, isPublished])
}

model DailyVlog {
  id            String   @id @default(cuid())
  userId        String
  slug          String
  title         String
  content       Json
  contentHtml   String?
  coverUrl      String?
  videos        Json?                    // MediaItem[]
  images        Json?                    // MediaItem[]
  tags          String[]
  publishedAt   DateTime?
  isPublished   Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, slug])
  @@index([userId, publishedAt])
}

model Knowledge {
  id              String   @id @default(cuid())
  userId          String
  slug            String
  title           String
  content         Json
  contentHtml     String?
  method          String?
  source          String?
  startedAt       DateTime?
  completedAt     DateTime?
  certificateUrl  String?
  certificatePublicId String?
  images          Json?
  tags            String[]
  isPublished     Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, slug])
}

model Settings {
  userId     String @id
  theme      String  @default("system")
  accentColor String?
  layout     String  @default("grid")
  modulesVisibility Json                 // xem SPEC_UI §9
  seo        Json?
  customDomain String?
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

> Lưu ý: `content` lưu JSON TipTap; `contentHtml` được server render từ JSON (dùng `@tiptap/html` server-side) mỗi lần ghi, phục vụ SEO/plain render.

---

## 5. REST API

Base: `/api/v1`. Tất cả endpoint ghi/riêng tư cần `Authorization: Bearer <accessToken>`.
Endpoint public đọc dữ liệu của người khác theo `username`.

### 5.1 Auth

| Method | Path | Body / Query | Trả |
|---|---|---|---|
| POST | `/auth/register` | `{email, username, password}` | `{user, accessToken, refreshToken}` |
| POST | `/auth/login` | `{emailOrUsername, password}` | `{user, accessToken, refreshToken}` |
| POST | `/auth/refresh` | `{refreshToken}` | `{accessToken, refreshToken}` |
| POST | `/auth/logout` | — | 204 |
| GET  | `/auth/me` | — | `User + Profile` |

- Password hash: **Argon2id**.
- Access token: HS256, TTL 15m. Refresh token: 30d, lưu hash trong DB (rotation + revoke).
- Rate limit: `/auth/*` 10 req/phút/IP.

### 5.2 Profile

| Method | Path | Mô tả |
|---|---|---|
| GET  | `/me/profile` | Lấy profile của chính mình |
| PUT  | `/me/profile` | Upsert profile |
| GET  | `/u/:username/profile` | **Public** – chỉ trả field theo Settings |

### 5.3 Projects (áp dụng tương tự cho `/daily`, `/knowledge`)

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET  | `/me/projects` | ✓ | List của chính mình (filter: `isPublished`, `q`, `page`, `pageSize`) |
| POST | `/me/projects` | ✓ | Tạo mới |
| GET  | `/me/projects/:id` | ✓ | Chi tiết |
| PATCH| `/me/projects/:id` | ✓ | Cập nhật |
| DELETE| `/me/projects/:id` | ✓ | Xóa |
| GET  | `/u/:username/projects` | public | Chỉ item `isPublished=true` |
| GET  | `/u/:username/projects/:slug` | public | Chi tiết public |

Response shape list:
```json
{
  "items": [...],
  "page": 1, "pageSize": 20, "total": 123
}
```

### 5.4 Settings

| Method | Path | Mô tả |
|---|---|---|
| GET  | `/me/settings` | Lấy settings |
| PUT  | `/me/settings` | Cập nhật |
| GET  | `/u/:username/settings/public` | Trả subset (theme, layout, modulesVisibility, seo) phục vụ viewer |

### 5.5 Cloudinary signing

| Method | Path | Body | Mô tả |
|---|---|---|---|
| POST | `/cloudinary/sign` | `{folder, resourceType: "image"|"video"|"raw"}` | Trả `{timestamp, signature, apiKey, cloudName, folder}`; yêu cầu auth |

Server ký bằng `cloudinary.utils.api_sign_request` với `CLOUDINARY_API_SECRET`. Giới hạn folder trong `selfos/{userId}/*`.

### 5.6 Health

- `GET /health` → `{status: "ok", db: "ok"}`.

---

## 6. DTO & validation (ví dụ Project)

```ts
export class CreateProjectDto {
  @IsString() @Length(2, 160) name!: string;
  @IsString() @Length(2, 200) slug!: string;         // slugify ở service nếu rỗng
  @IsOptional() @IsString() @MaxLength(500) summary?: string;
  @IsObject() content!: Record<string, unknown>;     // TipTap JSON

  @IsOptional() @IsUrl() coverUrl?: string;
  @IsOptional() @IsString() coverPublicId?: string;

  @IsOptional() @IsISO8601() startDate?: string;
  @IsOptional() @IsISO8601() endDate?: string;
  @IsOptional() @IsInt() @Min(1) teamSize?: number;

  @IsArray() @ArrayMaxSize(50) @IsString({ each: true }) technologies: string[] = [];
  @IsOptional() @IsString() results?: string;

  @IsOptional() @ValidateNested() @Type(() => RevenueDto) revenue?: RevenueDto;

  @IsOptional() @IsString() client?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsArray() @ValidateNested({each:true}) @Type(() => LinkDto) links?: LinkDto[];
  @IsOptional() @IsArray() @ValidateNested({each:true}) @Type(() => MediaItemDto) gallery?: MediaItemDto[];
  @IsBoolean() isPublished = false;
}
```

Guard `OwnershipGuard` đảm bảo `userId` tham số request trùng với token.

---

## 7. Bảo mật

- Helmet, CORS whitelist (origin = `WEB_ORIGIN`).
- Validation pipe global (`whitelist: true, forbidNonWhitelisted: true`).
- Argon2id (`memoryCost=19456, timeCost=2, parallelism=1`).
- Refresh token rotation + hash SHA-256 lưu DB; revoke khi logout/đổi mật khẩu.
- Rate limit: default 60 req/phút/IP; `/auth/*` thắt chặt hơn.
- Sanitize HTML output từ TipTap (sanitize-html) khi lưu `contentHtml` để tránh XSS khi viewer render.
- Giới hạn Cloudinary signing: resource_type whitelist, folder prefix cố định theo user.

---

## 8. Biến môi trường

`.env.example`:
```
NODE_ENV=development
PORT=4000
WEB_ORIGIN=http://localhost:3000

DATABASE_URL=postgresql://selfos:selfos@db:5432/selfos?schema=public

JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=selfos

THROTTLE_TTL=60
THROTTLE_LIMIT=60
```

Validate bằng Zod ở `config/env.validation.ts`.

---

## 9. Docker & docker-compose

**`Dockerfile`** (multi-stage):

```dockerfile
# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
```

**`docker-compose.yml`**:

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: selfos
      POSTGRES_PASSWORD: selfos
      POSTGRES_DB: selfos
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U selfos"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: .
    restart: unless-stopped
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    ports: ["4000:4000"]

volumes:
  pgdata:
```

Lệnh phổ biến:
```
docker compose up -d --build
docker compose exec api npx prisma migrate dev
docker compose exec api npm run seed
```

---

## 10. Deploy

- **Dev**: `docker compose up` (API ở `:4000`, DB ở `:5432`).
- **Prod**: build image Docker, push lên registry (GHCR / Docker Hub), chạy trên VPS (Caddy / Nginx reverse proxy, TLS Let's Encrypt), DB có thể dùng Neon / Supabase / managed Postgres.
- UI Vercel gọi API qua `NEXT_PUBLIC_API_BASE_URL=https://api.selfos.app`.
- CORS: `WEB_ORIGIN=https://selfos.app` (+ preview `*.vercel.app` nếu cần).

---

## 11. Chất lượng & vận hành

- ESLint + Prettier, TS strict.
- Unit test service (Jest), e2e Supertest cho auth + CRUD mỗi module.
- Swagger UI tại `/docs` (bật trong non-prod hoặc protect bằng basic auth).
- Pino log JSON → stdout, tích hợp Logtail/Datadog.
- Prometheus metrics (`@willsoto/nestjs-prometheus`) – tùy chọn.

---

## 12. Roadmap triển khai gợi ý

1. Khởi tạo NestJS CLI (`nest new server`), thêm Prisma + Postgres + docker-compose.
2. Module `auth` + `users` + JWT guard, refresh rotation.
3. Module `profile` + `settings`.
4. Module `projects` + `daily` + `knowledge` (CRUD + public endpoints theo username).
5. Module `cloudinary` (sign endpoint) + sanitize HTML pipeline.
6. Swagger, tests, Dockerize, CI.
7. Deploy prod + nối với Next.js UI trên Vercel.

---

## 13. Mapping sang dự án hiện tại

- Repo hiện tại chỉ có `src/index.ts` (TS skeleton). Khi bắt đầu BE: tạo thư mục `server/` cùng cấp và chạy `nest new server` bên trong, hoặc chuyển trực tiếp repo này thành NestJS workspace. Spec hiện tại giả định phương án **đặt BE trong `server/`** để dễ tách khỏi code Next.js tương lai (`web/`).
- `src/index.ts` cũ có thể xóa khi khởi tạo NestJS, hoặc giữ như placeholder nếu muốn triển khai một script phụ.
