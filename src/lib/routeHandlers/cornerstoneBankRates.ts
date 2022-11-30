import { error, json } from '@sveltejs/kit';
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
import type { Rates, RatesMatrix } from '$lib/typesAndInterfaces';
import { atob } from '$lib/general';

type Button = {
  url: string;
  text: string;
};

type RatesData = {
  title: string;
  ratesDate: string;
  tables: RatesMatrix[];
  disclaimer: string;
  button: Button;
};

function extractFragmentHTML(frag: DocumentFragment | HTMLElement) {
  return [].map.call(frag.children, (element: HTMLElement) => element.outerHTML).join('\n');
}

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

const cornerstoneBankRatesHandler = async (routeParams: any): Promise<Response> => {
  const res = await handlerBuilder(
    manipulator,
    mutator
  )(routeParams);

  const data = await res.json();

  const extractResult = extractDom(data);
  if (isErr(extractResult)) {
    console.error(extractResult.unwrapErr());
    throw error(500, 'Failed to create vDOM. :c');
  }
  let fragment = extractResult.unwrap().window.document.documentElement;

  const title = fragment.querySelector('.widgetHeaderTitle')?.innerHTML || '';

  const widgetDate = fragment.querySelector('.widgetDate')?.innerHTML || '';

  const rawTables = Array.from(
    fragment.querySelectorAll('.panel-body.widgetContainerBody .panel.innerContainer')
  );
  const tables = rawTables.map((element): RatesMatrix => {
    const heading =
      element.querySelector('.panel-heading.innerContainerHeader .innerHeadingTitle_small')
        ?.innerHTML || '';

    const ratesTableRows = Array.from(element.querySelectorAll('.table.ratesTable tr.datarow'));
    const ratesRows: Rates[] = ratesTableRows.map((row) => {
      let td: Element[] | number[] = Array.from(row.querySelectorAll('td'));
      td = td.map((td) => {
        let maybeAnchor = td.querySelector('a');
        if (maybeAnchor != null) {
          return parseFloat(maybeAnchor.innerHTML);
        }
        return parseFloat(td.innerHTML);
      });

      const rateDetails = row.querySelector('td:last-of-type a')?.getAttribute('data-html-b64');
      if (!rateDetails) {
        throw new Error('No rate details found!');
      }

      const detailNodes = extractDom(atob(rateDetails));
      if (isErr(detailNodes)) {
        console.error(detailNodes.unwrapErr());
        throw error(500, 'Failed to create vDOM. :c');
      }
      let rateDetailsFrag = detailNodes.unwrap().window.document.documentElement;

      const modalFooter = rateDetailsFrag.querySelector('.modal-footer');
      if (modalFooter != null) {
        modalFooter.parentElement?.removeChild(modalFooter);
      }

      return {
        rate: td[0],
        points: td[1],
        apr: td[2],
        details: extractFragmentHTML(rateDetailsFrag)
      };
    });

    return {
      title: heading,
      rates: ratesRows
    };
  });

  const disclaimer = fragment.querySelector('.disclaimer')?.innerHTML || '';

  const externalButton = fragment.querySelector('.btn.btn-block.externalLink');
  const button = {
    url: externalButton?.getAttribute('href') || '',
    text: externalButton?.innerHTML || ''
  };

  return json({
    title: title,
    ratesDate: widgetDate,
    tables: tables,
    disclaimer: disclaimer,
    button: button
  });
}

export default cornerstoneBankRatesHandler;