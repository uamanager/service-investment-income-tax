export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVS = 'DIVS',
}

export class Transaction {
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
    this.date = new Date(date);
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

  static buy(
    ticker: string,
    date: Date,
    currency: string,
    price: number,
    qty: number,
    currency_rate: number,
    fee_currency: string,
    fee_total_amount: number,
    fee_currency_rate: number,
  ) {
    return new Transaction(
      ticker,
      date,
      TransactionType.BUY,
      currency,
      price,
      qty,
      currency_rate,
      fee_currency,
      fee_total_amount,
      fee_currency_rate,
    );
  }

  static sell(
    ticker: string,
    date: Date,
    currency: string,
    price: number,
    qty: number,
    currency_rate: number,
    fee_currency: string,
    fee_total_amount: number,
    fee_currency_rate: number,
  ) {
    return new Transaction(
      ticker,
      date,
      TransactionType.SELL,
      currency,
      price,
      qty,
      currency_rate,
      fee_currency,
      fee_total_amount,
      fee_currency_rate,
    );
  }

  static divs(
    ticker: string,
    date: Date,
    currency: string,
    price: number,
    qty: number,
    currency_rate: number,
  ) {
    return new Transaction(
      ticker,
      date,
      TransactionType.DIVS,
      currency,
      price,
      qty,
      currency_rate,
      '',
      0,
      0,
    );
  }
}
