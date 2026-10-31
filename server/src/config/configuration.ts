import { Env } from './env.validation';

export const configuration = (env: Env) => ({
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  webOrigin: env.WEB_ORIGIN,
  database: { url: env.DATABASE_URL },
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTtl: env.JWT_ACCESS_TTL,
    refreshTtl: env.JWT_REFRESH_TTL,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    uploadFolder: env.CLOUDINARY_UPLOAD_FOLDER,
  },
  throttle: { ttl: env.THROTTLE_TTL, limit: env.THROTTLE_LIMIT },
  swaggerEnabled: env.SWAGGER_ENABLED,
});

export type AppConfig = ReturnType<typeof configuration>;
