import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const DEFAULT_DB_URL =
  "postgresql://neondb_owner:npg_si9fM8gyAZCx@ep-young-scene-a1czywn2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

function getSanitizedDbUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // Catch missing, template variables (${{...}}), Prisma proxies, or unescaped invalid domain strings
  if (
    !envUrl ||
    envUrl.includes("${{") ||
    envUrl.includes("db.prisma.io") ||
    envUrl.includes("postgres://postgres:")
  ) {
    return DEFAULT_DB_URL;
  }

  try {
    const parsed = new URL(envUrl);
    if (!parsed.protocol.startsWith("postgres") || !parsed.hostname) {
      return DEFAULT_DB_URL;
    }
    return envUrl;
  } catch (_e) {
    return DEFAULT_DB_URL;
  }
}

const createPrismaClient = () => {
  const nodeEnv = process.env.NODE_ENV;
  const dbUrl = getSanitizedDbUrl();

  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Singleton Prisma instance to prevent connection leakage in serverless environments
export const db = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = db;
