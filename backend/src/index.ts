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
import projectRouter from "./routes/project";
import projectIdeasRoute from "./routes/projectIdeas";

const app = express();

const allowedOrions = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:9009",
];

// app.use(cors({credentials:true,origin:["http://localhost:5173","https://task-management-frontend-b5s2.onrender.com"]}));s
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:4353",
      "http://localhost:9000",
      "http://127.0.0.1:9000",
      "http://localhost:5173",
    ],
    
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "access-control-allow-origin"],
  })
);

app.use(express.urlencoded({ extended: true }));
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
app.use("/api/projects", projectRouter);
app.use("/api/projects-ideas", projectIdeasRoute);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server started on ${env.BASE_URL}`);
});
