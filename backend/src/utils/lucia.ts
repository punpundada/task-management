import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import db from "../db";
import { session, user } from "../db/schema";
import { Lucia, TimeSpan } from "lucia";
import env from "./env";

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  fresh: boolean;
}

interface DatabaseUserAttributes {
  name: string;
  id: string;
  email:string
  email_verified:boolean
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface DatabaseSessionAttributes {
    ip_country: string;
  }
}

const adapter = new DrizzleSQLiteAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, "w"), // 2 weeks
  getSessionAttributes: (attributes) => {
    return {
      ipCountry: attributes.ip_country,
    };
  },
  getUserAttributes: (attributes) => {
    return attributes
},
sessionCookie:{
    name:"session",
    expires:false,
    attributes:{
        sameSite:"strict",
        secure:env.NODE_ENV === 'production'
    }
}
});

export default lucia;
