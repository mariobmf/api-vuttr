import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Tool from '../models/Tool';
import User from '../models/User';

interface Request {
  userId: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
}

class CreateToolService {
  public async execute({
    userId,
    title,
    link,
    description,
    tags,
  }: Request): Promise<Tool> {
    const toolRepository = getRepository(Tool);
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne(userId);

    if (!checkUserExists) throw new AppError('User not found', 401);

    const tool = toolRepository.create({
      user_id: userId,
      title,
      link,
      description,
      tags,
    });
    await toolRepository.save(tool);

    return tool;
  }
}
export default CreateToolService;
