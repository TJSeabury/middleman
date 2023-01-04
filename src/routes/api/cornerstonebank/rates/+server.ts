import type { RequestHandler } from './$types';
import withLogger, { _filename } from '$lib/logger';
import cornerstoneBankRatesHandler from '$lib/routeHandlers/cornerstoneBankRates';
import withCache from '$lib/cacher';

const {
  cachedHandler,
  invalidator,
  revalidator
} = withCache(
  async (routeParams) => await cornerstoneBankRatesHandler(routeParams),
  '/api/cornerstonebank/rates'
);

export const invalidate = invalidator;
export const revalidate = revalidator;

export const GET: RequestHandler = cachedHandler;
