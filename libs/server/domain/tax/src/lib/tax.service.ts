import { Inject, Injectable, Logger } from '@nestjs/common';
import taxConfig from './tax.config';
import { ConfigType } from '@nestjs/config';
import { LoggerHelper } from '@investment-income-tax/server-common';
import { InvestIncomeTax, Transaction } from '@investment-income-tax/core';

@Injectable()
export class TaxService {
  private readonly $_logger: LoggerHelper;

  constructor(
    $_logger: Logger,
    @Inject(taxConfig.KEY)
    private readonly _taxConfig: ConfigType<typeof taxConfig>,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async calculateTax(year: number, transactions: Transaction[]) {
    try {
      return InvestIncomeTax.calculateTax(year, transactions, this._taxConfig);
    } catch (error) {
      this.$_logger.fromError(error, 'Error while calculating tax', {
        year,
        transactions,
      });
      return Promise.reject(error);
    }
  }
}
