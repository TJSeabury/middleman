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
 * Intended to be used to perform actions on a given page.
 * Puppeteer's Browser and Page are available for manipution here.
 * This callback function is invoked after network is idle.
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
    // click to open the popup
    await link.click();

    const newPagePromise: Promise<Page> = new Promise(resolve => browser.once(
      'targetcreated',
      target => resolve(target.page())
    ));
    const popup = await newPagePromise;
    await popup.waitForSelector('.modal-body .table');
    //await popup.waitForNetworkIdle({ idleTime: 100 });

    // extract and save popup content
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
 * The DOM Mutator.
 * 
 * Intended to be used to format or clean the DOM before sending in Response.
 * This callback function is invoked after page manipulation has occured 
 * and after scripts and styles have been stripped.
 * 
 * @param dom 
 * @returns 
 */
const mutator = (dom: JSDOM): JSDOM => {
  const doc = dom.window.document;
  const panels = doc.querySelectorAll('.panel');
  if (panels) {
    for (const panel of panels) {
      panel.setAttribute('style', '');
    }
  }
  const button = doc.querySelector(
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