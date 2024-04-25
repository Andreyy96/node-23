import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", userController.getList);

router.post("/", commonMiddleware.isReqBodyValid, userController.create);

router.get("/:id", commonMiddleware.isIdValid, userController.getUser);

router.put(
  "/:id",
  commonMiddleware.isIdValid,
  commonMiddleware.isReqBodyValid,
  userController.update,
);

router.delete("/:id", commonMiddleware.isIdValid, userController.deleteUser);

export const userRouter = router;
