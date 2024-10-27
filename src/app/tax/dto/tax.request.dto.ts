import { TransactionType } from '../base/transaction-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray, IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TaxRequestDtoBodyTransaction {
  @ApiProperty({
    description: 'Ticker of the security',
    example: 'AAPL',
  })
  @IsNotEmpty()
  @IsString()
  ticker: string;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2023-01-01',
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Type of the transaction',
    example: TransactionType.BUY,
    enum: TransactionType,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Currency of the transaction',
    example: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Price per unit of the transaction',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Quantity of units in the transaction',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @ApiProperty({
    description: 'Currency of the transaction fee',
    example: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  fee_currency: string;

  @ApiProperty({
    description: 'Total fee for the transaction',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  fee_total_amount: number;
}

export class TaxRequestDtoBody {
  @ApiProperty({
    description: 'Year for which the tax will be calculated',
    example: 2023,
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: 'History of transactions',
    isArray: true,
    type: () => TaxRequestDtoBodyTransaction,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxRequestDtoBodyTransaction)
  transactions: TaxRequestDtoBodyTransaction[];
}
