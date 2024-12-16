import { Injectable, Logger } from '@nestjs/common';
import { RateHttpService } from './rate.http.service';
import { CacheMap, LoggerHelper } from '@investment-income-tax/server-common';

@Injectable()
export class RateService {
  private readonly _cache: CacheMap<number> = new CacheMap<number>(1000 * 60 * 60 * 24);
  private readonly $_logger: LoggerHelper;

  constructor($_logger: Logger, private readonly $_httpRate: RateHttpService) {
    this.$_logger = LoggerHelper.create($_logger, this.constructor.name);
  }

  async getRate(currency: string, date: Date | string | number): Promise<number> {
    try {
      const _date = new Date(date);
      const _key = `${currency}-${_date.getFullYear()}-${_date.getMonth()}-${_date.getDate()}`;
      const _cachedRate = this._cache.get(_key);

      if (_cachedRate) {
        this.$_logger.log(`Cached rate for ${_key}`, {
          currency,
          date,
        });

        return _cachedRate;
      } else {
        const _rateRequest = this.$_httpRate
          .getRate(currency, _date)
          .then((_rate) => {
            this.$_logger.log(`Resolved rate for ${_key}`, {
              currency,
              date,
            });

            return _rate.rate;
          })
          .catch((error) => {
            this.$_logger.fromError(error, 'Error while getting rate', {
              currency,
              date,
            });
            this._cache.delete(_key);
            return Promise.reject();
          });

        this._cache.set(_key, _rateRequest);

        return _rateRequest;
      }
    } catch (error) {
      this.$_logger.fromError(error, 'Error while getting rate', {
        currency,
        date,
      });
      return Promise.reject(error);
    }
  }
}
