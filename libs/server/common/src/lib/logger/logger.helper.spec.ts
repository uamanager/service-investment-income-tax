import { LoggerHelper } from './logger.helper';
import { Logger } from '@nestjs/common';

describe('LoggerHelper', () => {
  it('should return a logger', () => {
    // GIVEN
    const _name = 'test-logger';

    // WHEN
    const _logger = LoggerHelper.create(new Logger(), _name);

    // THEN
    expect(_logger).toBeDefined();
  });
});
