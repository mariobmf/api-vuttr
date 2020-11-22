/* eslint-disable func-names */
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Tool from '../models/Tool';

import CreateToolService from '../services/CreateToolService';
import DeleteToolService from '../services/DeleteToolService';

class ToolController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { title, link, description, tags } = request.body;
    const { id } = request.user;

    const createTool = new CreateToolService();
    const tool = await createTool.execute({
      userId: id,
      title,
      link,
      description,
      tags,
    });

    const toolWithoutUserId = {
      id: tool.id,
      title: tool.title,
      link: tool.link,
      description: tool.description,
      tags: tool.tags,
      created_at: tool.created_at,
      updated_at: tool.updated_at,
    };

    return response.status(201).json(toolWithoutUserId);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { tag = '' } = request.query;

    const toolRepository = getRepository(Tool);

    const tools = await toolRepository
      .createQueryBuilder('tools')
      .where((query) => {
        if (!tag) return;
        query.where(':tag = ANY(tools.tags)', { tag });
      })
      .select([
        'tools.id',
        'tools.title',
        'tools.link',
        'tools.description',
        'tools.tags',
        'tools.created_at',
        'tools.updated_at',
      ])
      .getMany();

    return response.json(tools);
  }

  public async destroy(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id: toolId } = request.params;
    const { id: userId } = request.user;

    const deleteTool = new DeleteToolService();

    await deleteTool.execute({ toolId, userId });
    return response.status(204).send('Tool successfully deleted');
  }
}
export default new ToolController();
