import { Test } from '@nestjs/testing';
import { TaxApiService } from './tax.api.service';
import { TaxService } from '@investment-income-tax/server-domain-tax';
import { RateService } from '@investment-income-tax/server-domain-rate';
import { Logger } from '@nestjs/common';

describe('TaxApiService', () => {
  let taxApiService: TaxApiService;
  let taxService: TaxService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TaxService,
          useValue: {
            calculateTax: jest.fn(), // Mock implementation
          },
        },
        {
          provide: RateService,
          useValue: {
            getRate: jest.fn(), // Mock implementation
          },
        },
        Logger,
        TaxApiService,
      ],
    }).compile();

    taxApiService = module.get<TaxApiService>(TaxApiService);
    taxService = module.get<TaxService>(TaxService);
  });

  it('should be implemented', () => {
    expect(taxApiService).toBeDefined();
  });
});
