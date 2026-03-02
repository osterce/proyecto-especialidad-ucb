import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  NODE_ENV: get('NODE_ENV').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  JWT_EXPIRE: get('JWT_EXPIRE').required().asString(),
  POSTGRES_HOST: get('POSTGRES_HOST').required().asString(),
  POSTGRES_PORT: get('POSTGRES_PORT').required().asPortNumber(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_DATABASE: get('POSTGRES_DATABASE').required().asString(),
};
