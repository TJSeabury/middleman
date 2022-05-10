import express from 'express';
import bodyParser from 'body-parser';
import Puppeteer from 'puppeteer';
import {
  JSDOM,
  VirtualConsole,
} from 'jsdom';
import { urlResolver } from './lib/url.js';

const app = express();
const port = 3000;

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

  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto( target, { waitUntil: 'networkidle0' } );
  const html = await page.content();
  await browser.close();

  const virtualConsole = new VirtualConsole();
  virtualConsole.on( "error", () => { } ); // No-op to skip console errors.

  const dom = new JSDOM( html, {
    virtualConsole
  } );
  if ( !dom ) {
    return res.status( 500 ).json( 'Failed to create vDOM. :c' );
  }

  const scripts = Array.from( dom.window.document.querySelectorAll( 'script' ) );
  for ( const script of scripts ) {
    if ( script.parentNode ) {
      script.parentNode.removeChild( script );
    }
  }

  const styles = Array.from( dom.window.document.querySelectorAll( 'link[rel="stylesheet"],style' ) );
  for ( const style of styles ) {
    if ( style.parentNode ) {
      style.parentNode.removeChild( style );
    }
  }

  const body = dom.window.document.querySelector( 'body' );

  return res.send( body?.innerHTML || '' );
} );

app.listen( port, () => {
  console.log( `Example app listening on port ${port}` );
} );
