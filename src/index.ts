import "dotenv/config";
import express from "express";
import env from "./config/env";
import { globalErrorHandler } from "./middleware/error.middleware";
import userRouter from "./modules/users/users.routes";
import cors from "cors";
import orgRouter from "./modules/organizations/org.route";
import projectRouter from "./modules/projects/projects.route";
import taskRouter from "./modules/tasks/tasks.route";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Hello",
  });
});

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/organizations", orgRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);


app.use(globalErrorHandler);

app.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
});
