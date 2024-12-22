import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { TaxApiModule } from '@investment-income-tax/server-api-tax';

const API_PATH = '/tax/calculate';
describe('POST /api/v1/tax/calculate', () => {
  let _app: INestApplication;

  beforeAll(async () => {
    const _moduleRef = await Test.createTestingModule({
      imports: [TaxApiModule],
      providers: [Logger],
    }).compile();

    _app = _moduleRef.createNestApplication();
    await _app.init();
  });

  afterAll(async () => {
    await _app.close();
  });

  it('should be fine with minimal required data', () => {
    // GIVEN
    const _year = new Date().getFullYear();
    const _transactions = [];

    // WHEN
    return (
      request(_app.getHttpServer())
        .post(API_PATH)
        .send({
          year: _year,
          transactions: _transactions,
        })
        // THEN
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            divs: {
              expenses: 0,
              income: 0,
              incomeTax: 0,
              militaryTax: 0,
              result: 0,
              transactions: [],
            },
            orders: {
              expenses: 0,
              income: 0,
              incomeTax: 0,
              militaryTax: 0,
              result: 0,
              transactions: [],
            },
          });
        })
    );
  });

  it.each([['BUY'], ['SELL'], ['DIVS']])(
    'should be fine with %s transaction from previous year',
    async (type) => {
      // GIVEN
      const _year = new Date().getFullYear();
      const _transactions = [
        {
          date: new Date(_year - 1, 0, 1),
          type: 'BUY',
          ticker: 'AAPL',
          currency: 'USD',
          price: 100,
          qty: 1,
          fee_currency: 'USD',
          fee_total_amount: 10,
        },
        {
          date: new Date(_year - 1, 1, 1),
          type,
          ticker: 'AAPL',
          currency: 'USD',
          price: 100,
          qty: 1,
          fee_currency: 'USD',
          fee_total_amount: 10,
        },
      ];

      // WHEN
      return (
        request(_app.getHttpServer())
          .post(API_PATH)
          .send({
            year: _year,
            transactions: _transactions,
          })
          // THEN
          .expect(200)
          .then((res) => {
            expect(res.body).toEqual({
              divs: {
                expenses: 0,
                income: 0,
                incomeTax: 0,
                militaryTax: 0,
                result: 0,
                transactions: [],
              },
              orders: {
                expenses: 0,
                income: 0,
                incomeTax: 0,
                militaryTax: 0,
                result: 0,
                transactions: [],
              },
            });
          })
      );
    },
  );
});
