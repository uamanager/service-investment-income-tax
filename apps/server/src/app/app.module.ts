import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import qs from 'qs';
import appConfig from './app.config';
import { TaxApiModule } from '@investment-income-tax/server-api-tax';

export function paramsSerializer(params) {
  return qs.stringify(params, {
    arrayFormat: 'repeat',
    allowDots: true,
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [],
      validationSchema: appConfig,
      validationOptions: {
        abortEarly: true,
      },
    }),
    HttpModule.register({
      paramsSerializer: {
        serialize: paramsSerializer,
      },
    }),

    TaxApiModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
