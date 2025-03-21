import { Order } from './order.class';
import { Transaction } from './transaction.class';

export class TaxRecord {
  date: Date;
  ticker: string;
  income: number;
  expenses: number;
  result: number;

  constructor(date: Date, ticker: string, income: number, expenses: number) {
    this.date = new Date(date);
    this.ticker = ticker;
    this.income = income;
    this.expenses = expenses;
    this.result = income - expenses;
  }

  static fromOrder(order: Order) {
    const _feeSellTotal = order.fee_total_amount * order.fee_currency_rate;
    const _incomeTotal = order.qty * order.price * order.currency_rate - _feeSellTotal;

    const _feeBuyTotal = order.positions.reduce((accum, position) => {
      return accum + position.fee_price * position.qty * position.fee_currency_rate;
    }, 0);

    const _expensesBuyTotal = order.positions.reduce((accum, position) => {
      return accum + position.price * position.qty * position.currency_rate;
    }, 0);

    const _expensesTotal = _feeBuyTotal + _expensesBuyTotal;

    return new TaxRecord(order.date, order.ticker, _incomeTotal, _expensesTotal);
  }

  static fromDivTransaction(transaction: Transaction) {
    return new TaxRecord(
      transaction.date,
      transaction.ticker,
      transaction.qty * transaction.price * transaction.currency_rate -
        transaction.fee_total_amount * transaction.fee_currency_rate,
      0,
    );
  }
}
