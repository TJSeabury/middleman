import { Buffer } from "buffer";

export const btoa = (str: string) => Buffer.from(str, 'utf8').toString('base64');

export const atob = (str: string) => Buffer.from(str, 'base64').toString('utf8');

export function pipe<T>(V: T, funcs: Array<(x: T) => T>) {
  return funcs.reduce((v, f) => f(v), V);
}

export const wait = (duration: number) => new Promise((res) => setTimeout(res, duration));

export const datetimeNowEST = () => {
  let date = new Date().toLocaleString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'America/New_York'
    }
  );

  return date;
}