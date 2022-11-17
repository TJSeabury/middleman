import { Ok, Err } from "@sniptt/monads";
import type { Result } from "@sniptt/monads";

export function hasProtocol(uri: string): boolean {
  return /^https?:\/\//gm.test(uri);
}

export function linkIsAbsolute(uri: string): boolean {
  return /^https?:\/\/(?:\w+?\.){1,9}\w+\/?|^(?:\w+?\.){1,9}\w+\/?/gm.test(uri);
}

export function linkIsRelative(uri: string): boolean {
  return !linkIsAbsolute(uri);
}

/**
 * @todo this will break if protocol is included. fix for that.
 */
export function linkIsLocal(uri: string, domain: string): boolean {
  if (linkIsRelative(uri)) return true;
  return new RegExp(`^${domain}`).test(uri);
};

export function linkIsExternal(uri: string, domain: string): boolean {
  return !linkIsLocal(uri, domain);
}

/**
 * What even is this logic here...
 * @todo fix this...
 */
export const isUrl = (u: string) => {
  try {
    if (linkIsAbsolute(u)) {
      new URL(u);
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

export const isNotUrl = (u: string) => !isUrl(u);

export const makeLinkAbsolute = (link: string, domain: string) => {
  if (linkIsAbsolute(link)) return link;
  if (! /^\//.test(link)) link = '/' + link;
  return domain + link;
};

export const trimSlashes = (url: string) => url.replace(/^\/{2,}|\/+$/g, '');

export function urlResolver(uri: string, hostname: string | null = null): Result<string, Error> {
  try {
    uri = trimSlashes(uri);
    if (!hasProtocol(uri)) {
      if (linkIsAbsolute(uri)) {
        console.log('link is absolute');
        return Ok(new URL(`https://${uri}`).href);
      } else {
        if (!hostname) throw new Error(`${uri} requires a hostname to resolve.`);
        return Ok(new URL(`https://${hostname}/${uri}`).href);
      }
    } else {
      return Ok(new URL(uri).href);
    }
  } catch (err: any) {
    return Err(err);
  }
};

export function extractFileUri(url: string): Result<string, Error> {
  if (!url) return Err(new Error('URL string must be provided!'));

  const reg = /[\w\:\/\.-]+\/([\w\.-]+?)\.css/gm;
  const fileUri = reg.exec(url)?.[1];

  if (!fileUri) return Err(new Error('Failed to extract URI.'));

  return Ok(fileUri);
};
