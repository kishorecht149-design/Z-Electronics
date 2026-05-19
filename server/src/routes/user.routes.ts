import { Router } from "express";

import { getState, syncState } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get("/state", getState);
userRouter.put("/state", syncState);
