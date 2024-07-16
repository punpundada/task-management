import z from "zod";
const envars = import.meta.env;

const envarSchema = z.object({
  VITE_BACKEND_BASE_URL: z.string({
    required_error: "VITE_BACKEND_BASE_URL is missing from .env file",
  }),
});

try {
  envarSchema.parse(envars);
} catch (error) {
  console.error(error);
  process.exit(1);
}

export default envarSchema.parse(envars);
