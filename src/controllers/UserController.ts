/* eslint-disable func-names */
import { Request, Response } from 'express';

import CreateUserService from '../services/CreateUserService';

class UserController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({
      name,
      email,
      password,
    });
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return response.status(201).json(userWithoutPassword);
  }
}
export default new UserController();
