import express from 'express';
import { forgetPassword, google, resetPassword, signIn, signout, signUp } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const authRouter = new express.Router();

authRouter.post('/sign-up', signUp)
authRouter.post('/sign-in', signIn)
authRouter.post('/google', google)
authRouter.post('/signout', signout)
authRouter.post("/forgot-password", forgetPassword);
authRouter.post("/reset-password/:token", resetPassword);


export default authRouter;