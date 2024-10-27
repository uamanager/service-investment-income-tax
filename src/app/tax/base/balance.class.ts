import { TransactionRecord } from './transaction-record.class';
import { TransactionType } from './transaction-type.enum';

export class Position {
  ticker: string;
  date: Date;

  currency: string;
  price: number;
  qty: number;
  currency_rate: number;

  fee_currency: string;
  fee_price: number;
  fee_currency_rate: number;

  constructor(
    ticker: string,
    date: Date,
    currency: string,
    price: number,
    qty: number,
    currency_rate: number,
    fee_currency: string,
    fee_price: number,
    fee_currency_rate: number,
  ) {
    this.ticker = ticker;
    this.date = date;

    this.currency = currency;
    this.price = price;
    this.qty = qty;
    this.currency_rate = currency_rate;

    this.fee_currency = fee_currency;
    this.fee_price = fee_price;
    this.fee_currency_rate = fee_currency_rate;
  }
}

export class Balance {
  static from(transactions: TransactionRecord[]) {
    const _balance = new Balance();

    transactions.forEach((transaction) => {
      switch (transaction.type) {
        case TransactionType.BUY:
          _balance.buy(transaction);
          break;
        case TransactionType.SELL:
          _balance.sell(transaction);
          break;
      }
    });

    return _balance;
  }

  private readonly _balance: Map<string, Position[]> = new Map<string, Position[]>();

  buy(transaction: TransactionRecord) {
    if (transaction.type !== TransactionType.BUY) {
      throw new Error(
        `Invalid transaction: Only BUY transactions are allowed, but got ${
          transaction.type
        } for ${transaction.ticker} at ${transaction.date.toISOString()}`,
      );
    }

    if (!this._balance.has(transaction.ticker)) {
      const _newPosition = new Position(
        transaction.ticker,
        transaction.date,

        transaction.currency,
        transaction.price,
        transaction.qty,
        transaction.currency_rate,

        transaction.fee_currency,
        transaction.fee_price,
        transaction.fee_currency_rate,
      );

      this._balance.set(transaction.ticker, [_newPosition]);
    } else {
      const _positions = this._balance.get(transaction.ticker);
      const _newPosition = new Position(
        transaction.ticker,
        transaction.date,

        transaction.currency,
        transaction.price,
        transaction.qty,
        transaction.currency_rate,

        transaction.fee_currency,
        transaction.fee_price,
        transaction.fee_currency_rate,
      );

      _positions.push(_newPosition);

      this._balance.set(transaction.ticker, _positions);
    }
  }

  sell(transaction: TransactionRecord) {
    if (transaction.type !== TransactionType.SELL) {
      throw new Error(
        `Invalid transaction: Only SELL transactions are allowed, but got ${
          transaction.type
        } for ${transaction.ticker} at ${transaction.date.toISOString()}`,
      );
    }

    if (!this._balance.has(transaction.ticker)) {
      throw new Error(
        `Invalid transaction: There is no buy transaction for ${
          transaction.ticker
        } before ${transaction.date.toISOString()}`,
      );
    }

    this.clean();

    const _positions = this._balance.get(transaction.ticker);
    let _sellQtyLeft = transaction.qty;
    const _soldPositions: Position[] = [];

    while (_sellQtyLeft > 0) {
      const _firstPosition = _positions.shift();
      if (_firstPosition) {
        if (_sellQtyLeft >= _firstPosition.qty) {
          _soldPositions.push(_firstPosition);
          _sellQtyLeft -= _firstPosition.qty;
        } else {
          const _positionQtyLeft = _firstPosition.qty - _sellQtyLeft;

          _soldPositions.push(
            new Position(
              _firstPosition.ticker,
              _firstPosition.date,

              _firstPosition.currency,
              _firstPosition.price,
              _sellQtyLeft,
              _firstPosition.currency_rate,

              _firstPosition.fee_currency,
              _firstPosition.fee_price,
              _firstPosition.fee_currency_rate,
            ),
          );

          _positions.unshift(
            new Position(
              _firstPosition.ticker,
              _firstPosition.date,

              _firstPosition.currency,
              _firstPosition.price,
              _positionQtyLeft,
              _firstPosition.currency_rate,

              _firstPosition.fee_currency,
              _firstPosition.fee_price,
              _firstPosition.fee_currency_rate,
            ),
          );

          _sellQtyLeft = 0;
        }
      } else {
        throw new Error(
          `Invalid transaction: There is nothing to sell for ${
            transaction.ticker
          } before ${transaction.date.toISOString()}`,
        );
      }
    }

    this._balance.set(transaction.ticker, _positions);

    return _soldPositions;
  }

  getBalance(ticker?: string): Record<string, Position[]> {
    this.clean();

    if (ticker) {
      const _positions = this._balance.get(ticker);
      return {
        [ticker]: _positions ?? [],
      };
    } else {
      return Object.fromEntries(this._balance.entries());
    }
  }

  clean() {
    this._balance.forEach((position, ticker) => {
      const _positions = position.filter((position) => position.qty > 0);
      this._balance.set(ticker, _positions);
    });

    this._balance.forEach((position, ticker) => {
      if (position.length === 0) {
        this._balance.delete(ticker);
      }
    });
  }
}
