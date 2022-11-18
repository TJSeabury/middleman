import { error, json } from '@sveltejs/kit';
import puppeteer from 'puppeteer';
import {
  extractDom,
  stripScriptsAndStyles,
} from '../dom';
import { urlResolver } from '../url';
import { isErr } from "@sniptt/monads";
import type { DOMMutator, PageManipulator } from "../typesAndInterfaces";

export default function handlerBuilder(
  manipulator: PageManipulator = async (page, browser) => { },
  mutator: DOMMutator = (dom) => dom
) {
  return async function handler(routeParams: any) {
    const urlError = new Error('Must provide a valid URL.');
    const url = routeParams.url.searchParams.get('url');;
    console.log(url);
    // If the type of url is anything but string, then it is a bad query param.
    if (typeof url !== 'string') {
      console.error(urlError);
      throw error(422, urlError);
    }

    const resolvedResult = urlResolver(url);
    if (isErr(resolvedResult)) {
      console.error(urlError);
      throw error(422, urlError);
    }
    const targetUrl = resolvedResult.unwrap();

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    if (!!manipulator) {
      await manipulator(page, browser);
    }

    const html = await page.content();
    browser.close();

    const extractResult = extractDom(html)
      .andThen(stripScriptsAndStyles);

    if (isErr(extractResult)) {
      console.error(extractResult.unwrapErr());
      throw error(500, 'Failed to create vDOM. :c');
    }

    let dom = extractResult.unwrap();

    if (!!mutator) {
      dom = mutator(dom);
    }

    const body = dom.window.document.querySelector('body');

    return json(
      body?.innerHTML || '',
      {
        status: 200,
      }
    );
  };
}