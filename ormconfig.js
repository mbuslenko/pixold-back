const dotenv = require('dotenv');

dotenv.parse('./env');

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
} = process.env;

module.exports = [
  {
    'type': 'postgres',
    'host': DB_HOST,
    'port': DB_PORT,
    'database': DB_NAME,
    'username': DB_USER,
    'password': DB_PASS, 
    'autoSchemaSync': false,
    'entities': [`./src/models/*.entity{.ts,.js}`],
    'migrations': [
      './src/migrations/scripts/*.ts',
    ],
    'ssl': { 'rejectUnauthorized': false },
    cli: {
      'migrationsDir': './src/migrations/scripts',
    },
  },
];
