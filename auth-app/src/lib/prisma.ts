import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createClient();

globalForPrisma.prisma = prisma;

// Keep database connection alive — ping every 4 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch {
      // silently ignore keepalive failures
    }
  }, 4 * 60 * 1000)
}

export default prisma;