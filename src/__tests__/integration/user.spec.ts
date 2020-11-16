import request from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../app';
import { testDBConnection } from '../../database';

import User from '../../models/User';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await testDBConnection.create();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await testDBConnection.close();
  });

  beforeEach(async () => {
    await testDBConnection.clear();
  });

  it('Should register a new user', async () => {
    const createUser = getRepository(User);
    const user = createUser.create({
      name: 'User',
      email: 'user@user.com',
      password: '12345678',
    });

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: user.name, email: user.email });
  });
  it('Should deny user registration with email already registered', async () => {
    const createUser = getRepository(User);
    const user = createUser.create({
      name: 'User',
      email: 'user@user.com',
      password: '12345678',
    });
    await request(app).post('/users').send(user);
    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(409);
  });
});
