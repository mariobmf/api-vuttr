import { Router } from 'express';

import verifyAuth from '../middleware/auth';

import UserController from '../controllers/UserController';
import UserToolController from '../controllers/UserToolController';

const userRouter = Router();

userRouter.post('/', UserController.store);
userRouter.get('/tools', verifyAuth, UserToolController.index);

export default userRouter;
