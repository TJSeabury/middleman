import type { FunctionVariadicAnyReturn } from "./typesAndInterfaces";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Cache from '$lib/stores';

let cache: Map<string, any>;
Cache.subscribe((value) => {
  cache = value;
});

export function _dirname(metaUrl: string): string {
  return dirname(fileURLToPath(metaUrl));
}

export function _filename(metaUrl: string): string {
  return fileURLToPath(metaUrl);
}

export default function withCache(f: FunctionVariadicAnyReturn): FunctionVariadicAnyReturn {

  return async (...args) => {

    const cacheKey = `withCacheTest/${a}+${b}`;

    let fromCache = false;
    let sum: number;
    if (cache.has(cacheKey)) {
      sum = cache.get(cacheKey);
      fromCache = true;
    }
    else {
      sum = add(a, b);
      cache.set(cacheKey, sum);
      Cache.set(cache);
    }



    const result = await f(...args);

    return result;
  };

}