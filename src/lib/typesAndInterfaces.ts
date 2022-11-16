import { JSDOM } from 'jsdom';
import { Browser, Page } from 'puppeteer';

export type PageManipulator = (page: Page, browser: Browser) => Promise<void>;

export type DOMMutator = (dom: JSDOM) => JSDOM;