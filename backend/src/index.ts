import express from "express";
import env from "./utils/env";
import { CustomError, STATUS_CODES } from "./utils/lib";
import authRouter from "./routes/auth";
import { userRouter } from "./routes/user";
import errorHandler from "./middleware/errorHandler";
import { csrfProtection, validateSession } from "./middleware/authMiddleware";
import taskRouter from "./routes/task";
import cors from "cors";
import type { CorsOptions } from "cors";

const app = express();

const allowedOrions =
  env.NODE_ENV === "development"
    ? [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ]
    : [];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrions.includes(origin)) {
      callback(null, true);
    } else {
      callback(new CustomError("Not allowed by CORS", STATUS_CODES.FORBIDDEN));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded());
app.use(express.json());

app.get("/api/health-check", (req, res) => {
  return res.status(STATUS_CODES.OK).json({
    healthy: true,
  });
});

app.use(csrfProtection);
app.use(validateSession);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server started on ${env.BASE_URL}`);
});
