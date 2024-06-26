import { defineConfig } from "drizzle-kit";
import env from "./src/utils/env";
import type { Config } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
