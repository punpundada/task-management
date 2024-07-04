import express from "express";
import env from "./utils/env";
import { STATUS_CODES } from "./utils/lib";
import authRouter from "./routes/auth";
import { userRouter } from "./routes/user";
import errorHandler from "./middleware/errorHandler";
import { csrfProtection, validateSession } from "./middleware/authMiddleware";
import taskRouter from "./routes/task";
import cors from "cors";
const app = express();

app.use(env.NODE_ENV === "development" ? cors() : cors());
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
