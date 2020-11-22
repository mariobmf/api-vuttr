import request from 'supertest';

import app from '../../app';
import createConnection, { testDBConnection } from '../../database';

import factory from '../../database/factory';

describe('Users', () => {
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

  it('Should register a new user', async () => {
    const user = await factory.makeUser();

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: user.name, email: user.email });
  });

  it('Should deny user registration with email already registered', async () => {
    const user = await factory.createUser();

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(409);
  });
});
