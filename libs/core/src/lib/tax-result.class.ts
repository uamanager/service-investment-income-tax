import { TaxRecord } from './tax-record.class';

export class TaxResult {
  orders: TaxRecordsResult;
  divs: TaxRecordsResult;

  constructor(orders: TaxRecordsResult, divs: TaxRecordsResult) {
    this.orders = orders;
    this.divs = divs;
  }
}

export class TaxRecordsResult {
  transactions: TaxRecord[];
  income: number;
  expenses: number;
  result: number;
  militaryTax: number;
  incomeTax: number;

  constructor(
    transactions: TaxRecord[],
    income: number,
    expenses: number,
    result: number,
    militaryTax: number,
    incomeTax: number,
  ) {
    this.transactions = transactions;
    this.income = income;
    this.expenses = expenses;
    this.result = result;
    this.militaryTax = militaryTax;
    this.incomeTax = incomeTax;
  }
}
