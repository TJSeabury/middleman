import type { JSDOM } from 'jsdom';
import type { Browser, Page } from 'puppeteer';

export type PageManipulator = (page: Page, browser: Browser) => Promise<void>;

export type DOMMutator = (dom: JSDOM) => JSDOM;

export type FunctionVariadicAnyReturn = (...args: any[]) => any;

export type Rates = {
  rate: number,
  points: number,
  apr: number,
  details: string,
}

export type RatesMatrix = {
  title: string,
  rates: Rates[],
}
