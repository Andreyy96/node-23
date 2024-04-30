import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { AuthValidator } from "../validators/auth.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isReqBodyValid(AuthValidator.schemaForRegister),
  authController.signUp,
);

router.post(
  "/sign-in",
  commonMiddleware.isReqBodyValid(AuthValidator.schemaForLogin),
  authController.signIn,
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

export const authRouter = router;
