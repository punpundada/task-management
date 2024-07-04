import z from "zod";

const envarSchema = z.object({
  BACKEND_BASE_URL: z.string({
    required_error: "BACKEND_BASE_URL is missing from .env file",
  }),
});

try {
  envarSchema.parse(process.env);
} catch (error) {
  console.log(error);
  process.exit(1);
}

export default envarSchema.parse(process.env);
