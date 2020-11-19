/* eslint-disable func-names */
import { Request, Response } from 'express';

import CreateSessionService from '../services/CreateSessionService';

interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
}

class SessionController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { email, password }: UserData = request.body;
    const createSession = new CreateSessionService();
    const auth = await createSession.execute({ email, password });

    return response.status(200).json(auth);
  }
}
export default new SessionController();
