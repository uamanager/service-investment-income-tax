import { Test, TestingModule } from '@nestjs/testing';
import { TaxApiController } from './tax.api.controller';
import { TaxApiService } from './tax.api.service';
import { TaxRequestDtoBody } from './dto/tax.request.dto';
import { TaxResponseDto, TaxResponseDtoTaxable } from './dto/tax.response.dto';

describe('TaxApiController', () => {
  let taxApiController: TaxApiController;
  let taxApiService: TaxApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxApiController],
      providers: [
        {
          provide: TaxApiService,
          useValue: {
            calculateTax: jest.fn(), // Mock implementation
          },
        },
      ],
    }).compile();

    taxApiController = module.get<TaxApiController>(TaxApiController);
    taxApiService = module.get<TaxApiService>(TaxApiService);
  });

  it('should be implemented', () => {
    expect(taxApiController).toBeDefined();
  });

  describe('calculateTax', () => {
    it('should return tax details from TaxApiService', async () => {
      // Mock Data
      const mockRequest: TaxRequestDtoBody = new TaxRequestDtoBody();

      const mockResponse: TaxResponseDto = new TaxResponseDto(
        new TaxResponseDtoTaxable([], 0, 0, 0, 0, 0),
        new TaxResponseDtoTaxable([], 0, 0, 0, 0, 0),
      );

      // Mock Service Method
      jest.spyOn(taxApiService, 'calculateTax').mockResolvedValue(mockResponse);

      // Call Controller Method
      const result = await taxApiController.calculateTax(mockRequest);

      // Assertions
      expect(result).toEqual(mockResponse);
      expect(taxApiService.calculateTax).toHaveBeenCalledWith(
        mockRequest.year,
        mockRequest.transactions,
      );
      expect(taxApiService.calculateTax).toHaveBeenCalledTimes(1);
    });
  });
});
