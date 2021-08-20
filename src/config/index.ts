import * as dotEnvSafe from 'dotenv-safe'
import * as path from 'path'

if (process.env.NODE_ENV !== 'production') {
  let envPath = '.env'

  if (process.env.NODE_ENV) {
    envPath = `${envPath}.${process.env.NODE_ENV}`
  }

  dotEnvSafe.config({
    allowEmptyValues: true,
    example: path.resolve(__dirname, '../../.env.example'),
    path: path.resolve(process.cwd(), envPath),
  })
}

interface Config {
  readonly AUTH: {
    readonly TOKEN_SECRET: string
    readonly TOKEN_EXPIRATION_TIME: string
    readonly GOOGLE_oAUTH_CLIENT_ID: string
    readonly STEAM_API_KEY: string
    readonly DISCORD_CLIENT_ID: string
    readonly DISCORD_CLIENT_SECRET: string
    readonly DISCORD_BOT_TOKEN: string
    readonly DISCORD_GUILDID: string
    readonly DISCORD_BOT_ID: string
    readonly XBOX_USER_EMAIL: string
    readonly XBOX_USER_PASSWORD: string
  }
  readonly DB: {
    readonly AUDIT_SCHEMA: string
    readonly HOST: string
    readonly MAIN_SCHEMA: string
    readonly NAME: string
    readonly PASSWORD: string
    readonly PORT: number
    readonly USER: string
  }
  readonly LOGGING: {
    readonly TYPE: string
    readonly LEVEL: string
    readonly ERROR_FILE: string
    readonly COMBINED_FILE: string
  }
  readonly URL: {
    readonly BASE_URL: string
    readonly FRONTEND_URL: string
    readonly BOT_SERVER_URL: string
  }
  readonly NODE_ENV: string
  readonly SERVER_PORT: number
  readonly BOT_SERVER_PORT: number
}

const {
  AUTH_TOKEN_EXPIRATION_TIME,
  AUTH_TOKEN_SECRET,
  DB_HOST,
  DB_AUDIT_SCHEMA,
  DB_MAIN_SCHEMA,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME,
  DB_USERNAME,
  LOGGING_COMBINED_FILE,
  LOGGING_ERROR_FILE,
  LOGGING_LEVEL,
  LOGGING_TYPE,
  NODE_ENV,
  SERVER_PORT,
  GOOGLE_oAUTH_CLIENT_ID,
  STEAM_API_KEY,
  BASE_URL,
  FRONTEND_URL,
  BOT_SERVER_URL,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN,
  DISCORD_GUILDID,
  DISCORD_BOT_ID,
  BOT_SERVER_PORT,
  XBOX_USER_EMAIL,
  XBOX_USER_PASSWORD,
} = process.env

const config: Config = {
  AUTH: {
    TOKEN_EXPIRATION_TIME: AUTH_TOKEN_EXPIRATION_TIME,
    TOKEN_SECRET: AUTH_TOKEN_SECRET,
    GOOGLE_oAUTH_CLIENT_ID: GOOGLE_oAUTH_CLIENT_ID,
    STEAM_API_KEY: STEAM_API_KEY,
    DISCORD_CLIENT_ID: DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: DISCORD_CLIENT_SECRET,
    DISCORD_BOT_TOKEN: DISCORD_BOT_TOKEN,
    DISCORD_GUILDID: DISCORD_GUILDID,
    DISCORD_BOT_ID: DISCORD_BOT_ID,
    XBOX_USER_EMAIL: XBOX_USER_EMAIL,
    XBOX_USER_PASSWORD: XBOX_USER_PASSWORD,
  },
  DB: {
    AUDIT_SCHEMA: DB_AUDIT_SCHEMA,
    HOST: DB_HOST,
    MAIN_SCHEMA: DB_MAIN_SCHEMA,
    NAME: DB_NAME,
    PASSWORD: DB_PASSWORD,
    PORT: parseInt(DB_PORT, 10),
    USER: DB_USERNAME,
  },
  LOGGING: {
    COMBINED_FILE: LOGGING_COMBINED_FILE,
    ERROR_FILE: LOGGING_ERROR_FILE,
    LEVEL: LOGGING_LEVEL,
    TYPE: LOGGING_TYPE,
  },
  URL: {
    BASE_URL: BASE_URL,
    FRONTEND_URL: FRONTEND_URL,
    BOT_SERVER_URL: BOT_SERVER_URL,
  },
  NODE_ENV,
  SERVER_PORT: parseInt(SERVER_PORT, 10),
  BOT_SERVER_PORT: parseInt(BOT_SERVER_PORT, 10),
}

export default config
