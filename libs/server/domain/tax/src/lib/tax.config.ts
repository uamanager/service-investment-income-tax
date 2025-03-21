import { registerAs } from '@nestjs/config';
import { ITaxConfig } from '@investment-income-tax/core';

export default registerAs('tax', () => {
  return {
    income_rate: +(process.env['TAX_INCOME_RATE'] || 0.18),
    income_divs_rate: +(process.env['TAX_INCOME_DIVS_RATE'] || 0.09),
    military_rate: +(process.env['TAX_MILITARY_RATE'] || 0.015),
  } as ITaxConfig;
});
