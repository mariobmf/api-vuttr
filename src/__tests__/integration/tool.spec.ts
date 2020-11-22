import request from 'supertest';
import { v4 as uuidV4 } from 'uuid';

import app from '../../app';
import createConnection, { testDBConnection } from '../../database';

import factory from '../../database/factory';

import generateJwtToken from '../../utils/generateJwtToken';

describe('Tools', () => {
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

  it('Should register a tool', async () => {
    const user = await factory.createUser();

    const tool = factory.makeTool();

    const response = await request(app)
      .post('/tools')
      .set('Authorization', `Bearer ${generateJwtToken(user.id)}`)
      .send(tool);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ title: tool.title });
  });

  it('Should list all tools', async () => {
    const user = await factory.createUser();

    await factory.createTool({ user_id: user.id });

    const response = await request(app)
      .get('/tools')
      .set('Authorization', `Bearer ${generateJwtToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('Should list all tools with filter tag', async () => {
    const user = await factory.createUser();

    const tool = await factory.createTool({ user_id: user.id });

    const response = await request(app)
      .get(`/tools?tags=${tool.tags[0]}`)
      .set('Authorization', `Bearer ${generateJwtToken(user.id)}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('Should delete tool', async () => {
    const user = await factory.createUser();

    const tool = await factory.createTool({ user_id: user.id });

    const response = await request(app)
      .delete(`/tools/${tool.id}`)
      .set('Authorization', `Bearer ${generateJwtToken(user.id)}`);

    expect(response.status).toBe(204);
  });

  it('Should not delete tool with a non-existent id', async () => {
    const user = await factory.createUser();
    const response = await request(app)
      .delete(`/tools/${uuidV4()}`)
      .set('Authorization', `Bearer ${generateJwtToken(user.id)}`);
    expect(response.status).toBe(404);
  });
});
