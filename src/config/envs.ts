import * as joi from 'joi';
import 'dotenv/config';

interface EnvsSchema {
  PORT: number;
  PAYPAL_SECRET: string;
  PAYPAL_CLIENT_ID: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    PAYPAL_CLIENT_ID: joi.string().required(),
    PAYPAL_SECRET: joi.string().required(),
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
  PAYPAL_CLIENT_ID:value.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET:value.PAYPAL_SECRET,
};
