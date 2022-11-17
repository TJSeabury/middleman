import fs from 'fs';
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

import basicHandler from './routeHandlers/basic';

import cornerstoneBankRatesHandler from './routeHandlers/cornerstoneBankRates';

import { env } from 'node:process';

const mode = env.NODE_ENV;

const app = express();
const port = 3000;

app.use(require('express-status-monitor')());
app.use(cors());
app.use(express.static('public'));

// support parsing of application/json type post data
//app.use( bodyParser.json() );
app.use(bodyParser.text());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Spot check if this even works on start.
 * Likely cause of failure is no Chromium on host machine.
 */
(async () => {
  try {
    const browser = await puppeteer.launch();
    await browser.close();
  } catch (err: any) {
    console.log(err);
  }
})();

/**
 * The default route for this service.
 * 
 * This basic route and handler simply acts as a middleman to GET the 
 * requested resource at the given URL.
 * No additional operations are performed.
 */
app.get('/', basicHandler);

/**
 * 
 */
app.get('/cornerstone-rates', cornerstoneBankRatesHandler);


app.listen(port, () => {
  console.log(`Middleman listening on port ${port}`);
});
