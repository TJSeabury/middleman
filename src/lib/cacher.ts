import { json } from '@sveltejs/kit';
import type {
  FunctionVariadicAnyReturn,
  AsyncFunctionRoutehandlerAnyReturn,
  RouteParams,
  FunctionRoutehandlerAnyReturn
} from "./typesAndInterfaces";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Cache from '$lib/stores';

type CachedHandlerAndKey = {
  cachedHandler: FunctionVariadicAnyReturn,
  invalidator: FunctionVariadicAnyReturn,
  revalidator: FunctionVariadicAnyReturn,
}

let cache: Map<string, any>;
Cache.subscribe((value) => {
  cache = value;
});

export default function withCache(
  f: FunctionVariadicAnyReturn,
  cacheKey: string,
): CachedHandlerAndKey {

  let currentlyRevalidating: Promise<any> | null = null;

  const cachedHandler = async (params: RouteParams) => {
    let response: any;

    if (cache.has(cacheKey)) {
      response = cache.get(cacheKey);
    } else {
      response = await f(params);
      response = await response.json();
      cache.set(cacheKey, response);
      Cache.set(cache);
    }

    return json(response);
  };

  const invalidator = async () => {
    cache.delete(cacheKey);
  };

  const revalidator = async (params: RouteParams) => {
    if (currentlyRevalidating && currentlyRevalidating instanceof Promise) {
      await currentlyRevalidating;
    } else {
      currentlyRevalidating = new Promise<void>(async (resolve, reject) => {
        let response = await f(params);
        response = await response.json();
        cache.set(cacheKey, response);
        Cache.set(cache);
        resolve();
      });
      await currentlyRevalidating;
      currentlyRevalidating = null;
    }
  };

  return {
    cachedHandler: cachedHandler,
    invalidator: invalidator,
    revalidator: revalidator,
  };

}