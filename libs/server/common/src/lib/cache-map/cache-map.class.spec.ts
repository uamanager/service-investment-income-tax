import { CacheMap } from './cache-map.class';

describe('CacheMap', () => {
  let cacheMap: CacheMap<number>;

  beforeEach(() => {
    cacheMap = new CacheMap<number>(1000);
  });

  it('should return null for non-existing key', () => {
    // GIVEN
    const _key = 'non-existing-key';

    // WHEN
    const _result = cacheMap.get(_key);

    // THEN
    expect(_result).toBeNull();
  });

  it('should return value for existing key', () => {
    //GIVEN
    const _key = 'existing-key';
    const _value = Promise.resolve(Math.random());
    cacheMap.set(_key, _value);

    // WHEN
    const _result = cacheMap.get(_key);

    // THEN
    expect(_result).not.toBeNull();
    expect(_result).toBe(_value);
  });

  it('should return null for expired key', () => {
    // GIVEN
    jest.useFakeTimers();
    const _key = 'expired-key';
    const _value = Promise.resolve(Math.random());
    cacheMap.set(_key, _value);

    // WHEN
    jest.advanceTimersByTime(1001);
    const _result = cacheMap.get(_key);

    // THEN
    expect(_result).toBeNull();
  });

  it('should return null for not expired key', () => {
    // GIVEN
    jest.useFakeTimers();
    const _key = 'expired-key';
    const _value = Promise.resolve(Math.random());
    cacheMap.set(_key, _value);

    // WHEN
    jest.advanceTimersByTime(800);
    const _result = cacheMap.get(_key);

    // THEN
    expect(_result).not.toBeNull();
    expect(_result).toBe(_value);
  });
});
