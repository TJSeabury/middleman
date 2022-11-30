import type { RequestHandler } from './$types';
import withLogger, { _filename } from '$lib/logger';
import cornerstoneBankRatesHandler from '$lib/routeHandlers/cornerstoneBankRates';
import withCache from '$lib/cacher';

export const GET: RequestHandler = withCache(async (routeParams) => await cornerstoneBankRatesHandler(routeParams));
