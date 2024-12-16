import { Test } from '@nestjs/testing';
import { TaxService } from './tax.service';
import { Logger } from '@nestjs/common';
import taxConfig from './tax.config';

describe('TaxService', () => {
  let taxService: TaxService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Logger,
        {
          provide: taxConfig.KEY,
          useValue: {
            income_rate: 0.18,
            income_divs_rate: 0.09,
            military_rate: 0.015,
          },
        },
        TaxService,
      ],
    }).compile();

    taxService = module.get<TaxService>(TaxService);
  });

  it('should be implemented', () => {
    expect(taxService).toBeDefined();
  });
});
