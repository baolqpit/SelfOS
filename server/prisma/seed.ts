import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const DEFAULT_MODULES_VISIBILITY = {
  profile: {
    visible: true,
    fields: {
      fullName: true,
      email: true,
      phone: false,
      address: false,
      dateOfBirth: false,
      occupation: true,
      bio: true,
      avatarUrl: true,
      coverUrl: true,
      socialLinks: true,
    },
  },
  projects: { visible: true, showRevenue: false, showClient: true },
  daily: { visible: true },
  knowledge: { visible: true, showCertificates: true },
};

async function main() {
  const email = 'demo@selfos.local';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] user ${email} already exists – skipping.`);
    return;
  }

  const passwordHash = await argon2.hash('demo12345', {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const user = await prisma.user.create({
    data: {
      email,
      username: 'demo',
      passwordHash,
      profile: {
        create: {
          fullName: 'Demo User',
          email,
          occupation: 'Software Engineer',
          bio: 'Hello from selfOS!',
          socialLinks: { github: 'https://github.com/demo' },
        },
      },
      settings: {
        create: {
          theme: 'system',
          layout: 'grid',
          modulesVisibility: DEFAULT_MODULES_VISIBILITY,
        },
      },
    },
  });

  console.log(`[seed] created user id=${user.id}, login: ${email} / demo12345`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
