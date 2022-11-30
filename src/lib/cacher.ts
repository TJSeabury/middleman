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

  return async (params: RouteParams) => {
    const { route: { id } } = params;

    const cacheKey = id;

    let result: any;
    if (cache.has(cacheKey)) {
      result = cache.get(cacheKey);
    }
    else {
      result = await f(params);
      result = await result.json()
      cache.set(cacheKey, result);
      Cache.set(cache);
    }

    return json(result);
  };

}