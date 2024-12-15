import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TransactionRecord } from './base/transaction-record.class';
import { LoggerHelper } from '../common/logger/logger.helper';
import { TaxRequestDtoBodyTransaction } from './dto/tax.request.dto';
import { RateService } from '../rate/rate.service';
import { TaxResponseDto } from './dto/tax.response.dto';

@Injectable()
export class TaxApiService {
  private readonly $_logger: LoggerHelper;

  constructor(
    $_logger: Logger,
    private readonly $_tax: TaxService,
    private readonly $_rate: RateService,
  ) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async calculateTax(year: number, transactions: TaxRequestDtoBodyTransaction[]) : Promise<TaxResponseDto> {
    try {
      const _transactions = [];

      for (const transaction of transactions) {
        const _currency_rate = await this.$_rate.getRate(transaction.currency, transaction.date);
        const _fee_currency_rate = await this.$_rate.getRate(
          transaction.fee_currency,
          transaction.date,
        );
        _transactions.push(
          new TransactionRecord(
            transaction.ticker,
            transaction.date,
            transaction.type,

            transaction.currency,
            transaction.price,
            transaction.qty,
            _currency_rate,

            transaction.fee_currency,
            transaction.fee_total_amount,
            _fee_currency_rate,
          ),
        );
      }

      return await this.$_tax.calculateTax(year, _transactions).then((result) => {
        return new TaxResponseDto(result.orders, result.divs);
      });
    } catch (error) {
      this.$_logger.fromError(error, 'Error while calculating tax', {
        year,
        transactions,
      });
      throw new InternalServerErrorException(error);
    }
  }
}