import request from 'supertest';
import { getRepository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import app from '../../app';
import createConnection, { testDBConnection } from '../../database';

import User from '../../models/User';

describe('Sessions', () => {
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

  it('Should allow the user to login', async () => {
    const userRepository = getRepository(User);
    const user = userRepository.create({
      name: 'User',
      email: 'usersession@user.com',
      password: hashSync('12345678', 8),
    });
    await userRepository.save(user);

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: '12345678' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  it('Should deny login with incorrect email', async () => {
    const userRepository = getRepository(User);
    const user = userRepository.create({
      name: 'User',
      email: 'usersession@user.com',
      password: '12345678',
    });
    const response = await request(app)
      .post('/sessions')
      .send({ email: 'outro@email.com', password: user.password });

    expect(response.status).toBe(401);
  });
  it('Should deny login with incorrect password', async () => {
    const userRepository = getRepository(User);
    const user = userRepository.create({
      name: 'User',
      email: 'usersession@user.com',
      password: '12345678',
    });
    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: 'incorrect_password' });

    expect(response.status).toBe(401);
  });
});
