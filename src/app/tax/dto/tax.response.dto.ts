import { ApiProperty } from '@nestjs/swagger';

export class TaxResponseDtoTaxableOrder {
  @ApiProperty({
    description: 'Order date',
    example: '2022-01-01T00:00:00.000Z',
    type: 'date',
  })
  date: Date;

  @ApiProperty({
    description: 'Ticker',
    example: 'AAPL',
    type: 'string',
  })
  ticker: string;

  @ApiProperty({
    description: 'Income',
    example: 100,
    type: 'number',
  })
  income: number;

  @ApiProperty({
    description: 'Expenses',
    example: 100,
    type: 'number',
  })
  expenses: number;

  @ApiProperty({
    description: 'Result',
    example: 100,
    type: 'number',
  })
  result: number;

  constructor(
    date: Date,
    ticker: string,
    income: number,
    expenses: number,
    result: number,
  ) {
    this.date = date;
    this.ticker = ticker;
    this.income = income;
    this.expenses = expenses;
    this.result = result;
  }
}

export class TaxResponseDtoTaxable {
  @ApiProperty({
    description: 'Dividend Transactions',
    type: () => TaxResponseDtoTaxableOrder,
    isArray: true,
  })
  transactions: TaxResponseDtoTaxableOrder[];

  @ApiProperty({
    description: 'Income',
    example: 100,
    type: 'number',
  })
  income: number;

  @ApiProperty({
    description: 'Expenses',
    example: 100,
    type: 'number',
  })
  expenses: number;

  @ApiProperty({
    description: 'Result',
    example: 100,
    type: 'number',
  })
  result: number;

  @ApiProperty({
    description: 'Military Tax',
    example: 100,
    type: 'number',
  })
  militaryTax: number;

  @ApiProperty({
    description: 'Income Tax',
    example: 100,
    type: 'number',
  })
  incomeTax: number;

  constructor(
    transactions: TaxResponseDtoTaxableOrder[],
    income: number,
    expenses: number,
    result: number,
    militaryTax: number,
    incomeTax: number,
  ) {
    this.transactions = transactions.map((transaction) => {
      return new TaxResponseDtoTaxableOrder(
        transaction.date,
        transaction.ticker,
        transaction.income,
        transaction.expenses,
        transaction.result,
      );
    });
    this.income = income;
    this.expenses = expenses;
    this.result = result;
    this.militaryTax = militaryTax;
    this.incomeTax = incomeTax;
  }
}

export class TaxResponseDto {
  @ApiProperty({
    description: 'Orders Transactions',
    type: () => TaxResponseDtoTaxable,
  })
  orders: TaxResponseDtoTaxable;

  @ApiProperty({
    description: 'Dividend Transactions',
    type: () => TaxResponseDtoTaxable,
  })
  divs: TaxResponseDtoTaxable;

  constructor(orders: TaxResponseDtoTaxable, divs: TaxResponseDtoTaxable) {
    this.orders = new TaxResponseDtoTaxable(
      orders.transactions,
      orders.income,
      orders.expenses,
      orders.result,
      orders.militaryTax,
      orders.incomeTax,
    );
    this.divs = new TaxResponseDtoTaxable(
      divs.transactions,
      divs.income,
      divs.expenses,
      divs.result,
      divs.militaryTax,
      divs.incomeTax,
    );
  }
}
