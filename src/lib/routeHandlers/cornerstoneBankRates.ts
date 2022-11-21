import {
  extractDom,
  stripScriptsAndStyles,
} from '../dom';
import { isErr } from "@sniptt/monads";
import {
  btoa,
} from '../general'
import type { JSDOM } from 'jsdom';
import handlerBuilder from "./handlerBuilder";
import type { Browser, Page } from 'puppeteer';

/**
 * The browser page manipulator.
 * 
 * Puppeteer's Browser and Page are available for manipution here.
 * 
 * @param page 
 * @param browser 
 */
const manipulator = async (page: Page, browser: Browser) => {
  // Click on all the 'links' and store the popup window doms at an attribute of that element.
  const links = await page.$$(
    'a[ng-click]'
  );
  for (let i = 0, link = links[i]; i < links.length; ++i, link = links[i]) {
    await link.click();
    const newPagePromise: Promise<Page> = new Promise(x => browser.once(
      'targetcreated',
      target => x(target.page())
    ));
    const popup = await newPagePromise;
    await popup.waitForNetworkIdle({ idleTime: 50 });
    const html = await popup.content();

    const extractResult = extractDom(html)
      .andThen(stripScriptsAndStyles);
    if (isErr(extractResult)) {
      console.error(extractResult.unwrapErr());
    }
    let dom = extractResult.unwrap();

    let body: HTMLBodyElement | string | null = dom.window.document.querySelector('body');
    body = body?.innerHTML?.trim() || '';
    body = btoa(body);
    await link.evaluate((a, html) => a.setAttribute('data-html-b64', html), body);
  }
};

/**
 * 
 * @param dom 
 * @returns 
 */
const mutator = (dom: JSDOM): JSDOM => {
  const replacableNode = dom.window.document.querySelector(`.rates-container.replacable`);
  if (!replacableNode) return dom;
  const panels = replacableNode.querySelectorAll('.panel');
  if (panels) {
    for (const panel of panels) {
      panel.setAttribute('style', '');
    }
  }
  const date = replacableNode.querySelector('.widgetDate');
  if (date) {
    date.innerHTML = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'America/New_York'
    });
  }
  const button = replacableNode.querySelector(
    '.panel-body.widgetContainerBody .btn.btn-block.externalLink'
  );
  if (button) {
    button.setAttribute('style', '');
  }
  return dom;
}

const cornerstoneBankRatesHandler = handlerBuilder(
  manipulator,
  mutator
);

export default cornerstoneBankRatesHandler;