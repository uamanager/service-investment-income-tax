import { Logger, Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { ConfigModule } from '@nestjs/config';
import taxConfig from './tax.config';
import { RateModule } from '@investment-income-tax/server-domain-rate';

@Module({
  imports: [RateModule, ConfigModule.forFeature(taxConfig)],
  controllers: [],
  providers: [Logger, TaxService],
  exports: [TaxService],
})
export class TaxModule {}
