import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getList);

router.get("/me", authMiddleware.checkAccessToken, userController.getMe);

router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isReqBodyValid(UserValidator.schemaForPutUser),
  userController.updateMe,
);

router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

router.get("/:id", commonMiddleware.isIdValid, userController.getUser);
export const userRouter = router;
