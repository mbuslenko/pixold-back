import * as migrations from '../migrations';
import * as entities from '../models';

import { ConnectionOptions } from 'typeorm';

import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from '.';

export const dbConfig: ConnectionOptions = {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    logging: true,
    migrationsRun: true,
    migrations: Object.values(migrations),
    entities: Object.values(entities),
};
