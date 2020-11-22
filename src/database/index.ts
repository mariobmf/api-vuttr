import {
  createConnection,
  getConnectionOptions,
  Connection,
  getConnection,
} from 'typeorm';
import path from 'path';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    process.env.NODE_ENV === 'test'
      ? {
          name,
          type: 'postgres',
          host: '127.0.0.1',
          port: 5432,
          username: 'postgres',
          password: 'docker',
          database: 'vuttr_test',
          // type: 'sqlite',
          // database: './src/__tests__/database.sqlite3',
          entities: defaultOptions.entities,
          migrations: defaultOptions.migrations,
          cli: defaultOptions.cli,
        }
      : { name, ...defaultOptions }
  );
};

export const testDBConnection = {
  async close(connectionName = 'default'): Promise<void> {
    return getConnection(connectionName).close();
  },

  async clear(connectionName = 'default'): Promise<void> {
    const conn = getConnection(connectionName);
    const entities = conn.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = conn.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },

  async dropTables(connectionName: string): Promise<void> {
    const conn = getConnection(connectionName);
    const entities = conn.entityMetadatas;

    entities.forEach(async (entity) => {
      console.log(entity.tableName);

      const repository = conn.getRepository(entity.name);
      await repository.query(`DROP TABLE IF EXISTS ${entity.tableName}`);
    });
  },
};
