import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isReqBodyValid(UserValidator.schemaForRegister),
  authController.signUp,
);

router.post(
  "/sign-in",
  commonMiddleware.isReqBodyValid(UserValidator.schemaForLogin),
  authController.signIn,
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post(
  "/forgot-password",
  commonMiddleware.isReqBodyValid(UserValidator.forgotPassword),
  authController.forgotPassword,
);

router.put(
  "/forgot-password",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT),
  commonMiddleware.isReqBodyValid(UserValidator.setForgotPassword),
  authController.setForgotPassword,
);

export const authRouter = router;
