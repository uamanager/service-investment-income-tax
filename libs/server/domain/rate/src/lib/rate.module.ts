import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RateService } from './rate.service';
import { RateHttpService } from './rate.http.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [Logger, RateHttpService, RateService],
  exports: [RateService],
})
export class RateModule {}
