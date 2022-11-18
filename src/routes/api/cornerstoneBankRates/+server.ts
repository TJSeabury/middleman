import type { RequestHandler } from './$types';
import cornerstoneBankRatesHandler from '$lib/routeHandlers/cornerstoneBankRates';

export const GET: RequestHandler = async (routeParams) => await cornerstoneBankRatesHandler(routeParams);