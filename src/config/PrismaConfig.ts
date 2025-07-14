import { registerAs } from '@nestjs/config';

export const PrismaConfig = registerAs('prisma', () => ({
  databaseUrl: process.env.DATABASE_URL,
}));
