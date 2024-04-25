import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { validReqPostMiddleware } from "../middlewares/valid-req-post.middleware";
import { validReqPutMiddleware } from "../middlewares/valid-req-put.middleware";

const router = Router();

router.get("/", userController.getList);

router.post("/", validReqPostMiddleware.isIdValidReq, userController.create);

router.get("/:id", commonMiddleware.isIdValid, userController.getUser);

router.put(
  "/:id",
  commonMiddleware.isIdValid,
  validReqPutMiddleware.isIdValidReq,
  userController.update,
);

router.delete("/:id", commonMiddleware.isIdValid, userController.deleteUser);

export const userRouter = router;
