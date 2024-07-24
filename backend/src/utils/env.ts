import z, { ZodError } from "zod";

const nodeEnv = z.enum(["production", "development"], {
  required_error: "NODE_ENV is missing from envrironment variables",
});

const envarSchema = z.object({
  DATABASE_URL: z.string({
    required_error: "DATABASE_URL is missing from envrironment variables",
  }),
  AUTH_TOKEN: z.string({
    required_error: "TURSO_AUTH_TOKEN is missing from envrironment variables",
  }),
  NODE_ENV: nodeEnv,
  PORT: z.coerce.number({
    required_error: "PORT is missing from envrironment variables",
  }),
  BASE_URL: z.string({
    required_error: "BASE_URL is missing from envrironment variables",
  }),
  SMTP_HOST: z.string({
    required_error: "SMTP_HOST is missing from envrironment variables",
  }),
  SMTP_PORT: z.coerce.number({
    required_error: "SMTP_PORT is missing from envrironment variables",
  }),
  SMTP_USER: z.string({
    required_error: "SMTP_USER is missing from envrironment variables",
  }),
  SMTP_PASS: z.string({
    required_error: "SMTP_PASS is missing from envrironment variables",
  }),
  EMAIL_FROM: z.string({
    required_error: "EMAIL_FROM is missing from envrironment variables",
  }),
  FRONT_END_BASE_URL: z.string({
    required_error: "FRONT_END_BASE_URL is missing from envrironment variables",
  }),
  ALLOWED_ORIGINS: z
    .string({ required_error: "ALLOWED_ORIGINS is missing from environment variables" })
    .transform((x) => x.split(",").map(x=>x.trim())),
});

export type EnvSchema = z.infer<typeof envarSchema>;

try {
  envarSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    const errorMsg = error.issues.map((x) => x.message);
    console.error(errorMsg);
  } else {
    console.error(error);
  }
}

export default envarSchema.parse(process.env);
