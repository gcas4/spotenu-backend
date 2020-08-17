import express from 'express';
import { UserController } from '../controller/UserController';

export const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signup/admin", userController.signupAdmin);
userRouter.post("/signup/listener", userController.signupListener);
userRouter.post("/signup/band", userController.signupBand);
userRouter.post("/login", userController.login);
userRouter.get("/bands", userController.bands);
userRouter.post("/approve", userController.toApprove);