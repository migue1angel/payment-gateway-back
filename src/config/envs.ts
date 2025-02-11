import * as joi from 'joi';
import 'dotenv/config';

interface EnvsSchema {
  PORT: number;
  PAYPAL_SECRET: string;
  PAYPAL_CLIENT_ID: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PAYPAL_CLIENT_ID: joi.string().required(),
    PAYPAL_SECRET: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envs: EnvsSchema = {
  PORT: value.PORT,
  PAYPAL_CLIENT_ID: value.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET: value.PAYPAL_SECRET,
  DB_HOST: value.DB_HOST,
  DB_PORT: value.DB_PORT,
  DB_USERNAME: value.DB_USERNAME,
  DB_PASSWORD: value.DB_PASSWORD,
  DB_DATABASE: value.DB_DATABASE,
};
