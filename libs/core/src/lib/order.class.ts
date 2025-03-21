import { Transaction, TransactionType } from './transaction.class';
import { BalancePosition } from './balance.class';

export class Order {
  ticker: string;
  date: Date;
  type: TransactionType;
  currency: string;
  price: number;
  qty: number;
  currency_rate: number;
  fee_currency: string;
  fee_total_amount: number;
  fee_price: number;
  positions: BalancePosition[];
  fee_currency_rate: number;

  static from(transaction: Transaction, positions: BalancePosition[]) {
    return new Order(
      transaction.ticker,
      transaction.date,
      transaction.type,
      transaction.currency,
      transaction.price,
      transaction.qty,
      transaction.currency_rate,
      transaction.fee_currency,
      transaction.fee_total_amount,
      transaction.fee_price,
      transaction.fee_currency_rate,
      positions,
    );
  }

  constructor(
    ticker: string,
    date: Date,
    type: TransactionType,
    currency: string,
    price: number,
    qty: number,
    currency_rate: number,
    fee_currency: string,
    fee_total_amount: number,
    fee_price: number,
    fee_currency_rate: number,
    positions: BalancePosition[],
  ) {
    this.ticker = ticker;
    this.date = new Date(date);
    this.type = type;
    this.currency = currency;
    this.price = price;
    this.qty = qty;
    this.currency_rate = currency_rate;
    this.fee_currency = fee_currency;
    this.fee_total_amount = fee_total_amount;
    this.fee_price = fee_price;
    this.fee_currency_rate = fee_currency_rate;
    this.positions = positions;
  }
}
