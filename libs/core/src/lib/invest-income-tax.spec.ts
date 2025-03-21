import { InvestIncomeTax } from './invest-income-tax.class';
import { ITaxConfig } from './tax.config';
import { TaxRecordsResult, TaxResult } from './tax-result.class';
import { Transaction, TransactionType } from './transaction.class';

const _dummyTransaction = (
  year: number,
  type: TransactionType,
  ticker = 'AAPL',
  price = 1,
  qty = 1,
) => {
  switch (type) {
    case TransactionType.BUY:
      return Transaction.buy(
        ticker,
        new Date(`${year}-01-01`),
        'USD',
        price,
        qty,
        1,
        'USD',
        1,
        1,
      );

    case TransactionType.SELL:
      return Transaction.sell(
        ticker,
        new Date(`${year}-01-01`),
        'USD',
        price,
        qty,
        1,
        'USD',
        1,
        1,
      );

    case TransactionType.DIVS:
      return Transaction.divs(ticker, new Date(`${year}-01-01`), 'USD', price, qty, 1);
  }
};

describe('core', () => {
  const _taxConfig: ITaxConfig = {
    income_rate: 0.18,
    income_divs_rate: 0.09,
    military_rate: 0.015,
  };

  describe('core - control flow', () => {
    it('should return empty result for no transactions', () => {
      // given
      const _year = 2023;
      const _transactions: Transaction[] = [];

      // when
      const _result = InvestIncomeTax.calculateTax(_year, _transactions, _taxConfig);

      // then
      expect(_result).toBeInstanceOf(TaxResult);
      // orders
      expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
      expect(_result.orders.transactions.length).toBe(0);
      // divs
      expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
      expect(_result.divs.transactions.length).toBe(0);
    });

    describe('core - control flow - divs', () => {
      it('should return empty result for divs transactions before period', () => {
        // given
        const _year = 2023;
        const _divTransaction = _dummyTransaction(_year - 1, TransactionType.DIVS);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_divTransaction],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(0);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return empty result for divs transactions after period', () => {
        // given
        const _year = 2023;
        const _divTransaction = _dummyTransaction(_year + 1, TransactionType.DIVS);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_divTransaction],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(0);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return correct result for divs transactions in year period', () => {
        // given
        const _year = 2023;
        const _divTransaction = _dummyTransaction(_year, TransactionType.DIVS);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_divTransaction],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(0);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(1);
      });

      it('should return correct result for divs transactions in mixed period', () => {
        // given
        const _year = 2023;
        const _divTransactionBefore = _dummyTransaction(_year - 1, TransactionType.DIVS);
        const _divTransaction = _dummyTransaction(_year, TransactionType.DIVS);
        const _divTransactionAfter = _dummyTransaction(_year + 1, TransactionType.DIVS);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_divTransactionBefore, _divTransaction, _divTransactionAfter],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(0);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(1);
      });

      it('should return correct result for multiple divs transactions in year period', () => {
        // given
        const _year = 2023;
        const _divTransactionAAPL = _dummyTransaction(
          _year,
          TransactionType.DIVS,
          'AAPL',
        );
        const _divTransactionAMZN = _dummyTransaction(
          _year,
          TransactionType.DIVS,
          'AMZN',
        );

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_divTransactionAAPL, _divTransactionAMZN],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(0);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(2);
      });
    });

    describe('core - control flow - buy/sell', () => {
      it('should return empty result for buy transactions without sell transactions', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 1, TransactionType.BUY);
        const _buyTransaction = _dummyTransaction(_year, TransactionType.BUY);
        const _buyTransactionAfter = _dummyTransaction(_year + 1, TransactionType.BUY);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_buyTransactionBefore, _buyTransaction, _buyTransactionAfter],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(0);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return empty result for buy transaction with respective sell transaction before period', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 2, TransactionType.BUY);
        const _sellTransactionBefore = _dummyTransaction(_year - 1, TransactionType.SELL);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_buyTransactionBefore, _sellTransactionBefore],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(0);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return correct result for sell transaction with buy transaction', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 1, TransactionType.BUY);
        const _sellTransaction = _dummyTransaction(_year, TransactionType.SELL);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_buyTransactionBefore, _sellTransaction],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(1);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return correct result for sell transaction with buy transaction in respect to order history', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 1, TransactionType.BUY);
        const _sellTransaction = _dummyTransaction(_year, TransactionType.SELL);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_sellTransaction, _buyTransactionBefore],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(1);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return correct result for partial sell transaction with buy transaction', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(
          _year - 1,
          TransactionType.BUY,
          'AAPL',
          10,
          10,
        );
        const _sellTransaction = _dummyTransaction(_year, TransactionType.SELL, 'AAPL');

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_buyTransactionBefore, _sellTransaction],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(1);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return correct result for sell transaction with buy transaction and respect history', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 1, TransactionType.BUY);
        const _sellTransaction = _dummyTransaction(_year - 1, TransactionType.SELL);
        const _buyMoreTransaction = _dummyTransaction(_year, TransactionType.BUY);
        const _sellMoreTransaction = _dummyTransaction(_year, TransactionType.SELL);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [
            _buyTransactionBefore,
            _sellTransaction,
            _buyMoreTransaction,
            _sellMoreTransaction,
          ],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(1);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return correct result for partial sell transaction for multiple buy transactions', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 1, TransactionType.BUY);
        const _buyMoreTransaction = _dummyTransaction(_year, TransactionType.BUY);
        const _sellMoreTransaction = _dummyTransaction(_year, TransactionType.SELL);

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_buyTransactionBefore, _buyMoreTransaction, _sellMoreTransaction],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(1);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should return correct result for sell transaction for multiple buy transactions', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 1, TransactionType.BUY);
        const _buyMoreTransaction = _dummyTransaction(_year, TransactionType.BUY);
        const _sellMoreTransaction = _dummyTransaction(
          _year,
          TransactionType.SELL,
          'AAPL',
          10,
          2,
        );

        // when
        const _result = InvestIncomeTax.calculateTax(
          _year,
          [_buyTransactionBefore, _buyMoreTransaction, _sellMoreTransaction],
          _taxConfig,
        );

        // then
        expect(_result).toBeInstanceOf(TaxResult);
        // orders
        expect(_result.orders).toBeInstanceOf(TaxRecordsResult);
        expect(_result.orders.transactions.length).toBe(1);
        // divs
        expect(_result.divs).toBeInstanceOf(TaxRecordsResult);
        expect(_result.divs.transactions.length).toBe(0);
      });

      it('should throw an error for sell transaction that can not be fulfilled', () => {
        // given
        const _year = 2023;
        const _buyTransactionBefore = _dummyTransaction(_year - 1, TransactionType.BUY);
        const _sellMoreTransaction = _dummyTransaction(
          _year,
          TransactionType.SELL,
          'AAPL',
          10,
          2,
        );

        // when
        const _result = () =>
          InvestIncomeTax.calculateTax(
            _year,
            [_buyTransactionBefore, _sellMoreTransaction],
            _taxConfig,
          );

        // then
        expect(_result).toThrow();
      });

      it('should throw an error for sell transactions of position that is already sold', () => {
        // given
        const _year = 2023;
        const _buyTransaction = _dummyTransaction(_year - 1, TransactionType.SELL);
        const _sellTransaction = _dummyTransaction(_year - 1, TransactionType.SELL);
        const _secondSellTransaction = _dummyTransaction(_year, TransactionType.SELL);

        // when
        const _result = () =>
          InvestIncomeTax.calculateTax(
            _year,
            [_buyTransaction, _sellTransaction, _secondSellTransaction],
            _taxConfig,
          );

        // then
        expect(_result).toThrow();
      });

      it('should throw an error for sell transactions without respective buy transaction', () => {
        // given
        const _year = 2023;
        const _sellTransaction = _dummyTransaction(_year, TransactionType.SELL);

        // when
        const _result = () =>
          InvestIncomeTax.calculateTax(_year, [_sellTransaction], _taxConfig);

        // then
        expect(_result).toThrow();
      });
    });
  });

  // describe('core - data flow', () => {
  //
  // });
});
