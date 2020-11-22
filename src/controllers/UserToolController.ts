/* eslint-disable func-names */
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Tool from '../models/Tool';

class UserToolController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { tag = '' } = request.query;
    const { id: userId } = request.user;

    const toolRepository = getRepository(Tool);

    const tools = await toolRepository
      .createQueryBuilder('tools')
      .where((query) => {
        if (!tag) return;
        query.where(':tag = ANY(tools.tags)', { tag });
      })
      .andWhere('tools.user_id = :userId', { userId })
      .getMany();

    return response.json(tools);
  }
}
export default new UserToolController();
