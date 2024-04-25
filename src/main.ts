import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { ApiError } from "./api-error";
import { config } from "./configs/config";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status || 500).json(err.message);
  },
);
process.on("uncaughtException", (error) => {
  console.error("uncaughtException: ", error);
  process.exit(1);
});

app.listen(config.PORT, config.HOST, async () => {
  await mongoose.connect(config.MONGO_URL);
  console.log(`Server is running at http://${config.HOST}:${config.PORT}/`);
});
