import { PrismaClient } from "@prisma/client";

const DEFAULT_DB_URL =
  "postgresql://neondb_owner:npg_si9fM8gyAZCx@ep-young-scene-a1czywn2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const createPrismaClient = () => {
  const nodeEnv = process.env.NODE_ENV;
  let dbUrl = process.env.DATABASE_URL;

  // Use active Neon database if env var is missing, has invalid credentials for 'postgres', or points to broken proxy
  if (!dbUrl || dbUrl.includes("postgres://postgres:") || dbUrl.includes("db.prisma.io")) {
    dbUrl = DEFAULT_DB_URL;
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if ((process.env.NODE_ENV ?? "production") !== "production") {
  globalForPrisma.prisma = db;
}
