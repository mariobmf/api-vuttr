import { Router } from 'express';

import userRouter from './user.routes';
import sessionRouter from './session.routes';
import toolRouter from './tool.routes';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/sessions', sessionRouter);
routes.use('/tools', toolRouter);

export default routes;
