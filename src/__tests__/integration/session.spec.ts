import request from 'supertest';
import { getRepository } from 'typeorm';

import User from '../../models/User';

import app from '../../app';
import createConnection, { testDBConnection } from '../../database';

import factory from '../../database/factory';

describe('Sessions', () => {
  beforeAll(async () => {
    const connection = await createConnection('testing');

    await connection.runMigrations();
  });

  afterAll(async () => {
    await testDBConnection.clear('testing');
    await testDBConnection.close('testing');
    await testDBConnection.close();
  });

  beforeEach(async () => {
    await testDBConnection.clear('testing');
  });

  it('Should allow the user to login', async () => {
    const user = await factory.createUser({ password: '12345678' });

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: '12345678' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Should deny login with incorrect email', async () => {
    const user = await factory.createUser();
    const response = await request(app)
      .post('/sessions')
      .send({ email: 'outro@email.com', password: user.password });

    expect(response.status).toBe(401);
  });

  it('Should deny login with incorrect password', async () => {
    const user = await factory.createUser();
    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: 'incorrect_password' });

    expect(response.status).toBe(401);
  });
});
