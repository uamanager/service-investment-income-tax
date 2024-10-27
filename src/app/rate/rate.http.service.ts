import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom, tap } from 'rxjs';
import { LoggerHelper } from '../common/logger/logger.helper';

export interface GetRateResponseItem {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export type GetRateResponse = GetRateResponseItem[];

@Injectable()
export class RateHttpService {
  static readonly BASE_URL = 'https://bank.gov.ua';
  private readonly $_logger: LoggerHelper;

  constructor($_logger: Logger, private readonly $_http: HttpService) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async getRate(currency: string, date: Date | string | number) {
    try {
      const _date = new Date(date);
      const _dateYear = _date.getFullYear();
      const _dateMonth = String(_date.getMonth() + 1).padStart(2, '0');
      const _dateDay = String(_date.getDate()).padStart(2, '0');
      const _queryDate = `${_dateYear}${_dateMonth}${_dateDay}`;

      const _request$ = this.$_http.get<GetRateResponse>(
        '/NBUStatService/v1/statdirectory/exchange',
        {
          baseURL: RateHttpService.BASE_URL,
          params: {
            valcode: currency,
            date: _queryDate,
            json: true,
          },
        },
      ).pipe(tap(() => {
        this.$_logger.debug('Requesting rate', {
          currency,
          date: _queryDate,
        });
      }));

      return await firstValueFrom<AxiosResponse<GetRateResponse>>(_request$).then(
        (response) => {
          return response.data && response.data.length > 0 ? response.data[0] : null;
        },
      );
    } catch (error) {
      this.$_logger.fromError(error, 'Error while getting rate', {
        currency,
        date,
      });
      return Promise.reject(error);
    }
  }
}
