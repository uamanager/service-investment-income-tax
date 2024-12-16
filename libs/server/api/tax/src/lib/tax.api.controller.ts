import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TaxApiService } from './tax.api.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaxRequestDtoBody } from './dto/tax.request.dto';
import { TaxResponseDto } from './dto/tax.response.dto';

@ApiTags('tax')
@Controller('tax')
export class TaxApiController {
  constructor(private readonly $_taxApiService: TaxApiService) {}

  @Post('calculate')
  @ApiOperation({
    summary: 'Calculate tax',
    description: 'Calculate tax',
  })
  @ApiOkResponse({
    description: 'Tax details',
    type: TaxResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  calculateTax(@Body() body: TaxRequestDtoBody): Promise<TaxResponseDto> {
    return this.$_taxApiService.calculateTax(body.year, body.transactions);
  }
}
