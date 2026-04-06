import express from 'express';
import { verifyAdmin, } from '../utils/verifyAdmin.js'
import { deleteUser, getAllUsers, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js'

const userRouter = new express.Router();

userRouter.get('/',verifyToken, verifyAdmin, getAllUsers)
userRouter.put('/:id', verifyToken, updateUser)
userRouter.delete('/:id', verifyToken, deleteUser)


export default userRouter;