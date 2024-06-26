import z, { ZodError } from 'zod';

const nodeEnv = z.enum(["production",'development'],{required_error:"NODE_ENV is missing from envrironment variables"})

const envarSchema = z.object({
    DATABASE_URL:z.string({required_error:"DATABASE_URL is missing from envrironment variables"}),
    AUTH_TOKEN:z.string({required_error:"TURSO_AUTH_TOKEN is missing from envrironment variables"}),
    NODE_ENV:nodeEnv,
    PORT:z.coerce.number({required_error:"PORT is missing from envrironment variables"}),
    BASE_URL:z.string({required_error:"BASE_URL is missing from envrironment variables"})
})

export type EnvSchema = z.infer<typeof envarSchema>;


try {
    envarSchema.parse(process.env)
} catch (error) {
    if (error instanceof ZodError) {
        const errorMsg = error.issues.map(x=>x.message)
        console.error(errorMsg)
      } else {
        console.error(error);
      }
}

export default envarSchema.parse(process.env)