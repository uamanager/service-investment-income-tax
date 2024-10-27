import { Logger, Module } from '@nestjs/common';
import { RateModule } from '../rate/rate.module';
import { TaxService } from './tax.service';
import { TaxApiController } from './tax.api.controller';
import { TaxApiService } from './tax.api.service';
import { ConfigModule } from '@nestjs/config';
import taxConfig from './tax.config';

@Module({
  imports: [RateModule, ConfigModule.forFeature(taxConfig)],
  controllers: [TaxApiController],
  providers: [Logger, TaxService, TaxApiService],
  exports: [],
})
export class TaxModule {}
