import type { RequestHandler } from './$types';
import { invalidate, revalidate } from '../rates/+server';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  let valid = false;
  // check if rates have updated at source.

  if (!valid) {
    await revalidate();
  }

  return json(valid);
};
