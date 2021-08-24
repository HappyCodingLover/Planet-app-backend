import { ConnectionOptions } from 'typeorm'
import config from './src/config'

const connectionOptions: ConnectionOptions = {
  cli: {
    entitiesDir: 'src/packages/database/models',
    migrationsDir: 'src/packages/database/migrations',
  },
  //database: config.DB.NAME,
  entities: ['src/packages/database/models/*.ts'],
  //host: config.DB.HOST,
  logging: false,
  migrations: ['src/packages/database/migrations/*.ts'],
  //password: config.DB.PASSWORD,
  //port: config.DB.PORT,
  synchronize: false,
  type: 'postgres',
  //username: config.DB.USER,
  url: process.env.DATABASE_URL?process.env.DATABASE_URL:`postgres://${config.DB.USER}:${config.DB.PASSWORD}@${config.DB.HOST}:${config.DB.PORT}/${config.DB.NAME}`
}

module.exports = connectionOptions
