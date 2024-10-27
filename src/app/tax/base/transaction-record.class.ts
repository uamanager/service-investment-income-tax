import { TransactionType } from './transaction-type.enum';

export class TransactionRecord {
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
  fee_currency_rate: number;

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
    fee_currency_rate: number,
  ) {
    this.ticker = ticker;
    this.date = date;
    this.type = type;

    this.currency = currency;
    this.price = price;
    this.qty = qty;
    this.currency_rate = currency_rate;

    this.fee_currency = fee_currency;
    this.fee_total_amount = fee_total_amount;
    this.fee_price = this.fee_total_amount / this.qty;
    this.fee_currency_rate = fee_currency_rate;
  }
}
