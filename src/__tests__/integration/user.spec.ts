import request from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../app';
import createConnection, { testDBConnection } from '../../database';

import User from '../../models/User';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection('testing');

    await connection.runMigrations();
  });

  afterAll(async () => {
    await testDBConnection.clear('testing');
    await testDBConnection.close('testing');
  });

  beforeEach(async () => {
    await testDBConnection.clear('testing');
  });

  it('Should register a new user', async () => {
    const userRepository = getRepository(User);
    const user = userRepository.create({
      name: 'User',
      email: 'user@user.com',
      password: '12345678',
    });

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: user.name, email: user.email });
  });

  it('Should deny user registration with email already registered', async () => {
    const userRepository = getRepository(User);
    const user = userRepository.create({
      name: 'User',
      email: 'user@user.com',
      password: '12345678',
    });
    await userRepository.save(user);

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(409);
  });
});
