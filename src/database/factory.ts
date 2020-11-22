import * as faker from 'faker';
import { getRepository } from 'typeorm';

import User from '../models/User';
import Tool from '../models/Tool';

const factory = {
  makeUser(attributes = {}): User {
    const userRepository = getRepository(User);

    const user = userRepository.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...attributes,
    });

    return user;
  },

  async createUser(attributes = {}): Promise<User> {
    const userRepository = getRepository(User);

    const user = this.makeUser(attributes);

    await userRepository.save(user);

    return user;
  },

  makeTool(attributes = {}): Tool {
    const toolRepository = getRepository(Tool);

    const tool = toolRepository.create({
      title: faker.lorem.word(),
      link: faker.internet.url(),
      description: faker.lorem.sentence(),
      tags: [faker.lorem.word()],
      ...attributes,
    });

    return tool;
  },

  async createTool(attributes = {}): Promise<Tool> {
    const toolRepository = getRepository(Tool);

    const tool = this.makeTool(attributes);

    await toolRepository.save(tool);

    return tool;
  },
};

export default factory;
