import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import verifyAuth from '../middleware/auth';

import ToolController from '../controllers/ToolController';

const toolRouter = Router();

toolRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      link: Joi.string().required(),
      description: Joi.string().required(),
      tags: Joi.array().items(Joi.string().required()).required(),
    }),
  }),
  verifyAuth,
  ToolController.store
);
toolRouter.get('/', verifyAuth, ToolController.index);
toolRouter.delete('/:id', verifyAuth, ToolController.destroy);

export default toolRouter;
