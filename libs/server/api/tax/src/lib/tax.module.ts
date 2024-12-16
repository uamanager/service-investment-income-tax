import { Logger, Module } from '@nestjs/common';
import { TaxApiController } from './tax.api.controller';
import { TaxApiService } from './tax.api.service';
import { TaxModule } from '@investment-income-tax/server-domain-tax';
import { RateModule } from '@investment-income-tax/server-domain-rate';

@Module({
  imports: [TaxModule, RateModule],
  controllers: [TaxApiController],
  providers: [Logger, TaxApiService],
  exports: [],
})
export class TaxApiModule {}
