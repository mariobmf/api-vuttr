import { getRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

import AppError from '../errors/AppError';

import Tool from '../models/Tool';

interface Request {
  toolId: string;
  userId: string;
}

class DeleteToolService {
  public async execute({ toolId, userId }: Request): Promise<void> {
    const toolRepository = getRepository(Tool);

    const checkUuid = uuidValidate(toolId);

    if (!checkUuid) throw new AppError('Invalid ID', 400);

    const checkToolExists = await toolRepository.findOne(toolId);

    if (!checkToolExists) throw new AppError('Tool not found', 404);

    if (checkToolExists.user_id !== userId)
      throw new AppError('User without permission to delete tool', 401);

    await toolRepository.delete(toolId);
  }
}
export default DeleteToolService;
