import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) throw new AppError('User not found', 401);

    const isAuthorized = await compare(password, user.password);
    if (!isAuthorized) throw new AppError('Incorrect password', 401);

    const userId = user.id;
    const privateKey = String(process.env.APP_SECRET);
    const token = jwt.sign({ userId }, privateKey, {
      expiresIn: 300, // expires in 5min
    });
    return { user, token };
  }
}
export default CreateSessionService;
