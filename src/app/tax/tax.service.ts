import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionRecord } from './base/transaction-record.class';
import { LoggerHelper } from '../common/logger/logger.helper';
import { Balance } from './base/balance.class';
import { TransactionType } from './base/transaction-type.enum';
import { Order } from './base/order.class';
import taxConfig from './tax.config';
import { ConfigType } from '@nestjs/config';
import { TaxRecord } from './base/tax-record.class';

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

  async calculateTax(year: number, transactions: TransactionRecord[]) {
    try {
      const [_before, _period] = this._splitByTransactionsPeriods(year, transactions);
      const [_buysell, _divs] = this._splitByTransactionsTypes(_period);

      const _balance = Balance.from(_before);
      const _sellTransactions = [];

      _buysell.forEach((transaction) => {
        if (transaction.type === TransactionType.BUY) {
          _balance.buy(transaction);
        } else {
          _sellTransactions.push(Order.from(transaction, _balance.sell(transaction)));
        }
      });

      const _ordersTax = this._calculateOrdersTax(_sellTransactions);
      const _divsTax = this._calculateDivsTax(_divs);

      return Promise.resolve({
        orders: _ordersTax,
        divs: _divsTax,
      });
    } catch (error) {
      this.$_logger.fromError(error, 'Error while calculating tax', {
        year,
        transactions,
      });
      return Promise.reject(error);
    }
  }

  private _splitByTransactionsPeriods(
    year: number,
    transactions: TransactionRecord[],
  ): [TransactionRecord[], TransactionRecord[], TransactionRecord[]] {
    return transactions.reduce(
      ([before, period, after], transaction) => {
        if (transaction.date.getFullYear() < year) {
          return [[...before, transaction], period, after];
        }

        if (transaction.date.getFullYear() === year) {
          return [before, [...period, transaction], after];
        }

        return [before, period, [...after, transaction]];
      },
      [[], [], []],
    );
  }

  private _splitByTransactionsTypes(
    transactions: TransactionRecord[],
  ): [TransactionRecord[], TransactionRecord[]] {
    return transactions.reduce(
      ([buysell, divs], transaction) => {
        if (
          transaction.type === TransactionType.BUY ||
          transaction.type === TransactionType.SELL
        ) {
          return [[...buysell, transaction], divs];
        }
        return [buysell, [...divs, transaction]];
      },
      [[], []],
    );
  }

  private _calculateOrdersTax(orders: Order[]) {
    const _taxOrders = orders.map((order) => {
      return TaxRecord.fromOrder(order);
    });

    const _totalIncome = _taxOrders.reduce((accum, taxOrder) => {
      return accum + taxOrder.income;
    }, 0);

    const _totalExpenses = _taxOrders.reduce((accum, taxOrder) => {
      return accum + taxOrder.expenses;
    }, 0);

    const _totalResult = _taxOrders.reduce((accum, taxOrder) => {
      return accum + taxOrder.result;
    }, 0);

    const _militaryTax =
      _totalResult > 0 ? _totalResult * this._taxConfig.military_rate : 0;
    const _incomeTax = _totalResult > 0 ? _totalResult * this._taxConfig.income_rate : 0;

    return {
      transactions: _taxOrders,
      income: _totalIncome,
      expenses: _totalExpenses,
      result: _totalResult,
      militaryTax: _militaryTax,
      incomeTax: _incomeTax,
    };
  }

  private _calculateDivsTax(transactions: TransactionRecord[]) {
    const _taxTransactions = transactions.map((transaction) => {
      return TaxRecord.fromDivTransaction(transaction);
    });

    const _totalIncome = _taxTransactions.reduce((accum, taxTransaction) => {
      return accum + taxTransaction.income;
    }, 0);

    const _totalResult = _taxTransactions.reduce((accum, taxTransaction) => {
      return accum + taxTransaction.result;
    }, 0);

    const _militaryTax =
      _totalResult > 0 ? _totalResult * this._taxConfig.military_rate : 0;
    const _incomeTax =
      _totalResult > 0 ? _totalResult * this._taxConfig.income_divs_rate : 0;

    return {
      transactions: _taxTransactions,
      income: _totalIncome,
      expenses: 0,
      result: _totalResult,
      militaryTax: _militaryTax,
      incomeTax: _incomeTax,
    };
  }
}
