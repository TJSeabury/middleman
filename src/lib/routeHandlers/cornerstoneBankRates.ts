import {
  extractDom,
  stripScriptsAndStyles,
} from '../dom';
import { isErr } from "@sniptt/monads";
import {
  btoa,
} from '../general'
import handlerBuilder from "./handlerBuilder";
import type { Browser, Page } from 'puppeteer';

const cornerstoneBankRatesHandler = handlerBuilder(
  async (page: Page, browser: Browser) => {
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
  }
);

export default cornerstoneBankRatesHandler;