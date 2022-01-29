import { loadConfig } from '../common/utils/load-config';
import { EnvDto } from './env.dto';

const config = loadConfig<EnvDto>(EnvDto);

const {
  NODE_ENV,
  PORT,

  // Database
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,

  // Coin
  STELLAR_ISSUER_PUBLIC_KEY,
  STELLAR_ISSUER_SECRET_KEY,
  STELLAR_DISTRIBUTOR_PUBLIC_KEY,
  STELLAR_DISTRIBUTOR_SECRET_KEY,
  STELLAR_USER_PUBLIC_KEY,
  STELLAR_USER_SECRET_KEY,
  STELLAR_API_URL,

  // Google oauth
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,

  // auth
  AUTH_SALT,
  ENCRYPTION_PASSWORD,

  // notifications
  TELEGRAM_NOTIFICATIONS_CHAT,
  TELEGRAM_BOT_TOKEN,

  // websocket
  NOTIFICATIONS_SECURITY_TOKEN,
} = config;

export {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  STELLAR_ISSUER_PUBLIC_KEY,
  STELLAR_ISSUER_SECRET_KEY,
  STELLAR_DISTRIBUTOR_PUBLIC_KEY,
  STELLAR_DISTRIBUTOR_SECRET_KEY,
  STELLAR_USER_PUBLIC_KEY,
  STELLAR_USER_SECRET_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  AUTH_SALT,
  ENCRYPTION_PASSWORD,
  STELLAR_API_URL,
  TELEGRAM_NOTIFICATIONS_CHAT,
  TELEGRAM_BOT_TOKEN,
  NOTIFICATIONS_SECURITY_TOKEN,
};
