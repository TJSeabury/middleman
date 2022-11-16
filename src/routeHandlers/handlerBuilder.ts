import { Request, Response } from "express";
import * as puppeteer from 'puppeteer';
import {
  extractDom,
  stripScriptsAndStyles,
} from '../lib/dom';
import { urlResolver } from '../lib/url';
import { isErr } from "@sniptt/monads";
import { DOMMutator, PageManipulator } from "../lib/typesAndInterfaces";

export default function handlerBuilder(
  manipulator: PageManipulator = async (page, browser) => { },
  mutator: DOMMutator = (dom) => dom
) {
  return async function handler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const urlError = new Error('Must provide a valid URL.');
    const url = req.query?.url;
    // If the type of url is anything but string, then it is a bad query param.
    if (typeof url !== 'string') {
      console.error(urlError);
      return res.status(422).json(urlError);
    }

    const resolvedResult = urlResolver(url);
    if (isErr(resolvedResult)) {
      console.error(urlError);
      return res.status(422).json(urlError);
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
      return res.status(500).json('Failed to create vDOM. :c');
    }

    let dom = extractResult.unwrap();

    if (!!mutator) {
      dom = mutator(dom);
    }

    const body = dom.window.document.querySelector('body');

    return res.status(200).json(body?.innerHTML || '');
  };
}