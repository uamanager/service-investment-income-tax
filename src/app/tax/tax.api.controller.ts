import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { TaxApiService } from './tax.api.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaxRequestDtoBody } from './dto/tax.request.dto';
import { LoggerHelper } from '../common/logger/logger.helper';
import { TaxResponseDto } from './dto/tax.response.dto';

@ApiTags('tax')
@Controller('tax')
export class TaxApiController {
  private readonly $_logger: LoggerHelper;

  constructor($_logger: Logger, private readonly $_taxApiService: TaxApiService) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

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
