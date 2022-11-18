import type { RequestHandler } from './$types';
import basicHandler from '$lib/routeHandlers/basic';

export const GET: RequestHandler = (routeParams) => basicHandler(routeParams);