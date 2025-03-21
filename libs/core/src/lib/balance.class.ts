import { Transaction, TransactionType } from './transaction.class';

export class BalancePosition {
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
    this.date = new Date(date);

    this.currency = currency;
    this.price = price;
    this.qty = qty;
    this.currency_rate = currency_rate;

    this.fee_currency = fee_currency;
    this.fee_price = fee_price;
    this.fee_currency_rate = fee_currency_rate;
  }

  static from(position: BalancePosition, overrides: Partial<BalancePosition> = {}) {
    const _next = {
      ...position,
      ...overrides,
    };
    return new BalancePosition(
      _next.ticker,
      _next.date,
      _next.currency,
      _next.price,
      _next.qty,
      _next.currency_rate,
      _next.fee_currency,
      _next.fee_price,
      _next.fee_currency_rate,
    );
  }
}

export class Balance {
  static from(transactions: Transaction[]) {
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

  private readonly _balance: Map<string, BalancePosition[]> = new Map<
    string,
    BalancePosition[]
  >();

  buy(transaction: Transaction): void {
    this.clean();

    if (!this._balance.has(transaction.ticker)) {
      const _newPosition = BalancePosition.from(transaction);

      this._balance.set(transaction.ticker, [_newPosition]);
    } else {
      const _positions = this._balance.get(transaction.ticker) ?? [];
      const _newPosition = BalancePosition.from(transaction);

      _positions.push(_newPosition);

      this._balance.set(transaction.ticker, _positions);
    }
  }

  sell(transaction: Transaction): BalancePosition[] {
    if (!this._balance.has(transaction.ticker)) {
      throw new Error(
        `Invalid transaction: There is no buy transaction for ${
          transaction.ticker
        } before ${transaction.date.toISOString()}`,
      );
    }

    this.clean();

    const _positions = this._balance.get(transaction.ticker) ?? [];
    let _sellQtyLeft = transaction.qty;
    const _soldPositions: BalancePosition[] = [];

    while (_sellQtyLeft > 0) {
      const _firstPosition = _positions.shift();
      if (_firstPosition) {
        if (_sellQtyLeft >= _firstPosition.qty) {
          _soldPositions.push(_firstPosition);
          _sellQtyLeft -= _firstPosition.qty;
        } else {
          const _positionQtyLeft = _firstPosition.qty - _sellQtyLeft;

          _soldPositions.push(
            BalancePosition.from(_firstPosition, { qty: _sellQtyLeft }),
          );

          _positions.unshift(
            BalancePosition.from(_firstPosition, { qty: _positionQtyLeft }),
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

    this.clean();

    return _soldPositions;
  }

  clean() {
    this._balance.forEach((position, ticker) => {
      const _positions = position.filter((position) => position.qty > 0);
      if (position.length === 0) {
        this._balance.delete(ticker);
      } else {
        this._balance.set(ticker, _positions);
      }
    });
  }
}
