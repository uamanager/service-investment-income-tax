export interface CacheItem<T> {
  value: Promise<T>;
  ttl: number;
}

export class CacheMap<T> {
  private readonly _cache: Map<string, CacheItem<T>> = new Map<string, CacheItem<T>>();
  private readonly _ttl: number;

  constructor(ttl: number) {
    this._ttl = ttl;
  }

  get(key: string): Promise<T> | null {
    const _now = Date.now();
    const _item = this._cache.get(key);

    if (_item && _item.ttl > _now) {
      return Promise.resolve(_item.value);
    }
    return null;
  }

  set(key: string, value: T | Promise<T>, ttl: number = this._ttl): void {
    this._cache.set(key, { value: Promise.resolve(value), ttl: Date.now() + ttl });
    return;
  }

  delete(key: string): void {
    this._cache.delete(key);
    return;
  }
}
