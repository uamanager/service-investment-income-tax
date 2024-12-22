import { Test } from '@nestjs/testing';
import { RateHttpService } from './rate.http.service';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

describe('RateHttpService', () => {
  let rateHttpService: RateHttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Logger,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(), // Mock implementation
          },
        },
        RateHttpService,
      ],
    }).compile();

    rateHttpService = module.get<RateHttpService>(RateHttpService);
  });

  it('should be implemented', () => {
    expect(rateHttpService).toBeDefined();
  });
});
