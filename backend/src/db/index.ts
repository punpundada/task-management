import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import env from "../utils/env";
import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.AUTH_TOKEN,
});

const db = drizzle(client, { schema, logger: env.NODE_ENV === "development" });

export type db = typeof db;
export default db;
