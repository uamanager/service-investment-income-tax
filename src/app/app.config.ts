import Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('production'),
  PORT: Joi.number().default(3000),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly')
    .default('silly'),

  // APP
  APP_ID: Joi.string().default('investment-income-tax'),
  APP_NAME: Joi.string().default('Investment Income Tax'),
  APP_VERSION: Joi.string().default('1.0.0'),

  // API
  API_ROOT_PREFIX: Joi.string().valid('api').default('api'),
  API_DEFAULT_VERSION: Joi.number().valid(1).default(1),

  // DOCS
  DOCS_ROOT_PREFIX: Joi.string().valid('docs').default('docs'),
});
