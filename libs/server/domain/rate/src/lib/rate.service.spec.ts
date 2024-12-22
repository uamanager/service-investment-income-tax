import { Test } from '@nestjs/testing';
import { RateService } from './rate.service';
import { Logger } from '@nestjs/common';
import { RateHttpService } from './rate.http.service';

describe('RateService', () => {
  let rateService: RateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: RateHttpService,
          useValue: {
            getRate: jest.fn(), // Mock implementation
          },
        },
        Logger,
        RateService,
      ],
    }).compile();

    rateService = module.get<RateService>(RateService);
  });

  it('should be implemented', () => {
    expect(rateService).toBeDefined();
  });
});
