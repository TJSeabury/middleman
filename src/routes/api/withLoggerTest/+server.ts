import withLogger, { _filename } from '$lib/logger';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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

    const sum = add(a, b);

    if (isNaN(sum)) {
      console.error(`a and b must be numbers, received ${a} and ${b}`);
      throw error(400, 'a and b must be numbers');
    }

    return new Response(String(sum));
  },
  _filename(import.meta.url)
); 