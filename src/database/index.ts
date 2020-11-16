import {
  createConnection,
  getConnectionOptions,
  Connection,
  getConnection,
} from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  return createConnection({ name, ...defaultOptions });
};

export const testDBConnection = {
  async create(): Promise<Connection> {
    return createConnection({
      name: 'default',
      type: 'sqlite',
      database: './src/__tests__/database.sqlite3',
      synchronize: true,
      logging: false,
      dropSchema: true,
    });
  },

  async close(): Promise<void> {
    return getConnection().close();
  },

  async clear(): Promise<void> {
    const conn = getConnection();
    const entities = conn.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = conn.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};
