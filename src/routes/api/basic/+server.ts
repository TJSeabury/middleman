import type { RequestHandler } from './$types';
import withLogger, { _filename } from '$lib/logger';
import basicHandler from '$lib/routeHandlers/basic';

export const GET: RequestHandler = withLogger(
  (routeParams) => basicHandler(routeParams),
  _filename(import.meta.url)
);