import withLogger, { _filename } from '$lib/logger';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Cache from '$lib/stores';

let cache: Map<string, any>;
Cache.subscribe((value) => {
  cache = value;
});

const add = (a: number, b: number): number => {
  const sum = a + b;
  console.log(`${a} + ${b} = ${sum}`);
  return sum;
};

export const GET: RequestHandler = withLogger(
  (routeParams) => {
    const { url } = routeParams;
    const a = Number(url.searchParams.get('a') ?? '0');
    const b = Number(url.searchParams.get('b') ?? '1');

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

    if (isNaN(sum)) {
      console.error(`a and b must be numbers, received ${a} and ${b}`);
      throw error(400, 'a and b must be numbers');
    }

    return new Response(`Sum: ${sum}, Cached?: ${fromCache}`);
  },
  _filename(import.meta.url)
);