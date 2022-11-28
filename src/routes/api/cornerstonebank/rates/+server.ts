import type { RequestHandler } from './$types';
import withLogger, { _filename } from '$lib/logger';
import cornerstoneBankRatesHandler from '$lib/routeHandlers/cornerstoneBankRates';

export const GET: RequestHandler = withLogger(
  async (routeParams) => await cornerstoneBankRatesHandler(routeParams),
  _filename(import.meta.url)
);
