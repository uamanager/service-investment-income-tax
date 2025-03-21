import { ITaxConfig } from './tax.config';
import { Transaction, TransactionType } from './transaction.class';
import { Balance } from './balance.class';
import { Order } from './order.class';
import { TaxRecord } from './tax-record.class';
import { TaxRecordsResult, TaxResult } from './tax-result.class';

export class InvestIncomeTax {
  static calculateTax(
    year: number,
    transactions: Transaction[],
    config: ITaxConfig,
  ): TaxResult {
    try {
      const [_before, _period] = this._splitByTransactionsPeriods(year, transactions);
      const [_buysell, _divs] = this._splitByTransactionsTypes(_period);

      const _balance = Balance.from(_before);
      const _sellTransactions: Order[] = [];

      _buysell.forEach((transaction) => {
        if (transaction.type === TransactionType.BUY) {
          _balance.buy(transaction);
        } else {
          _sellTransactions.push(Order.from(transaction, _balance.sell(transaction)));
        }
      });

      const _ordersTax = this._calculateOrdersTax(_sellTransactions, config);
      const _divsTax = this._calculateDivsTax(_divs, config);

      return new TaxResult(_ordersTax, _divsTax);
    } catch (error) {
      console.error(error, 'Error while calculating tax', {
        year,
        transactions,
      });
      throw error;
    }
  }

  private static _splitByTransactionsPeriods(
    year: number,
    transactions: Transaction[],
  ): [Transaction[], Transaction[], Transaction[]] {
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
      [[], [], []] as [Transaction[], Transaction[], Transaction[]],
    );
  }

  private static _splitByTransactionsTypes(
    transactions: Transaction[],
  ): [Transaction[], Transaction[]] {
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
      [[], []] as [Transaction[], Transaction[]],
    );
  }

  private static _calculateOrdersTax(
    orders: Order[],
    config: ITaxConfig,
  ): TaxRecordsResult {
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

    const _militaryTax = _totalResult > 0 ? _totalResult * config.military_rate : 0;
    const _incomeTax = _totalResult > 0 ? _totalResult * config.income_rate : 0;

    return new TaxRecordsResult(
      _taxOrders,
      _totalIncome,
      _totalExpenses,
      _totalResult,
      _militaryTax,
      _incomeTax,
    );
  }

  private static _calculateDivsTax(
    transactions: Transaction[],
    config: ITaxConfig,
  ): TaxRecordsResult {
    const _taxTransactions = transactions.map((transaction) => {
      return TaxRecord.fromDivTransaction(transaction);
    });

    const _totalIncome = _taxTransactions.reduce((accum, taxTransaction) => {
      return accum + taxTransaction.income;
    }, 0);

    const _totalResult = _taxTransactions.reduce((accum, taxTransaction) => {
      return accum + taxTransaction.result;
    }, 0);

    const _militaryTax = _totalResult > 0 ? _totalResult * config.military_rate : 0;
    const _incomeTax = _totalResult > 0 ? _totalResult * config.income_divs_rate : 0;

    return new TaxRecordsResult(
      _taxTransactions,
      _totalIncome,
      0,
      _totalResult,
      _militaryTax,
      _incomeTax,
    );
  }
}
