import express from 'express';
import bodyParser from 'body-parser';
import Puppeteer from 'puppeteer';
import {
  JSDOM,
  VirtualConsole,
  ResourceLoader
} from 'jsdom';
import fetch from 'node-fetch';
import { urlResolver } from './lib/url.js';
import { CustomResourceLoader } from './lib/CustomResourceLoader.js';

const app = express();
const port = 1337;

// support parsing of application/json type post data
//app.use( bodyParser.json() );
app.use( bodyParser.text() );

//support parsing of application/x-www-form-urlencoded post data
app.use( bodyParser.urlencoded( { extended: true } ) );

app.get( '/', async ( req, res ) => {
  const url = req.query?.url;
  const [target, urlResolverErr] = urlResolver( url );
  if ( !target || urlResolverErr ) {
    return res.status( 422 ).json( 'Must provide a valid URL.' );
  }
  const hostname = new URL( target ).hostname;

  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto( target, { waitUntil: 'networkidle0' } );
  const html = await page.content();
  await browser.close();

  return res.send( html );

  /* console.log( hostname );

  const response = await fetch( target );
  const text = await response.text();

  const virtualConsole = new VirtualConsole();
  virtualConsole.on( "error", () => { } ); // No-op to skip console errors.

  const resourceLoader = new ResourceLoader( {
    proxy: `https://${hostname}`,
    strictSSL: true,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
  } );

  const dom = new JSDOM( text, {
    runScripts: "dangerously",
    resources: new CustomResourceLoader( {
      proxy: `https://${hostname}`,
      strictSSL: true,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
    } )
  } );
  if ( !dom ) {
    return res.status( 500 ).json( 'Failed to create vDOM. :c' );
  }
 */
  /* const scripts = Array.from( dom.window.document.querySelectorAll( 'script' ) ).map( script => {
    if ( !script.src ) return script;
    let [goodUrl, err] = urlResolver( script.src, hostname );
    if ( goodUrl && err === null ) {
      script.src = goodUrl;
    }
    return script;
  } );

  const links = Array.from( dom.window.document.querySelectorAll( 'link[rel="stylesheet"]' ) ).map( link => {
    let [goodUrl, err] = urlResolver( link.href, hostname );
    if ( goodUrl && err === null ) {
      link.href = goodUrl;
    }
    return link;
  } ); */
} );

app.listen( port, () => {
  console.log( `Example app listening on port ${port}` );
} );
