const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const puppeteer = require( 'puppeteer' );
const {
  JSDOM,
  VirtualConsole,
} = require( 'jsdom' );

const hasProtocol = ( uri ) => /^https?:\/\//gm.test( uri );
const linkIsAbsolute = ( uri ) => /^https?:\/\/(?:\w+?\.){1,9}\w+\/?|^(?:\w+?\.){1,9}\w+\/?/gm.test( uri );
const trimSlashes = ( url ) => url.replace( /^\/{2,}|\/+$/g, '' );
const urlResolver = ( uri, hostname = null ) => {
  try {
    uri = trimSlashes( uri );
    if ( !hasProtocol( uri ) ) {
      if ( linkIsAbsolute( uri ) ) {
        console.log( 'link is absolute' );
        return [new URL( `https://${uri}` ).href, null];
      } else {
        if ( !hostname ) throw new Error( `${uri} requires a hostname to resolve.` );
        return [new URL( `https://${hostname}/${uri}` ).href, null];
      }
    } else {
      return [new URL( uri ).href, null];
    }
  } catch ( err ) {
    return [uri, err];
  }
};

const app = express();
const port = 3000;

// support parsing of application/json type post data
//app.use( bodyParser.json() );
app.use( bodyParser.text() );

//support parsing of application/x-www-form-urlencoded post data
app.use( bodyParser.urlencoded( { extended: true } ) );

const here = [];

here.push( 'init browser' );
const browser = await puppeteer.launch( {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
} );


app.get( '/', async ( req, res ) => {
  try {
    const url = req.query?.url;
    here.push( 'url: ' + url );
    const [target, urlResolverErr] = urlResolver( url );
    here.push( 'target: ' + target + ' ; urlResolverErr' + urlResolverErr );
    if ( !target || urlResolverErr ) {
      return res.status( 422 ).json( 'Must provide a valid URL.' );
    }

    try {
      here.push( 'new page' );
      const page = await browser.newPage();
      here.push( 'navigate to page' );
      await page.goto( target, { waitUntil: 'networkidle0' } );
      here.push( 'get content' );
      const html = await page.content();
      here.push( 'close page' );
      page.close();
    } catch ( err ) {
      here.push( browser );
    }

    const virtualConsole = new VirtualConsole();
    virtualConsole.on( "error", () => { } ); // No-op to skip console errors.

    const dom = new JSDOM( html, {
      virtualConsole
    } );
    here.push( 'start jsdom' );
    if ( !dom ) {
      return res.status( 500 ).json( 'Failed to create vDOM. :c' );
    }

    here.push( 'strip scripts' );
    const scripts = Array.from( dom.window.document.querySelectorAll( 'script' ) );
    for ( const script of scripts ) {
      if ( script.parentNode ) {
        script.parentNode.removeChild( script );
      }
    }

    here.push( 'strip styles' );
    const styles = Array.from( dom.window.document.querySelectorAll( 'link[rel="stylesheet"],style' ) );
    for ( const style of styles ) {
      if ( style.parentNode ) {
        style.parentNode.removeChild( style );
      }
    }

    here.push( 'extract modded body' );
    const body = dom.window.document.querySelector( 'body' );

    here.push( 'return' );
    return res.status( 200 ).json( body?.innerHTML || '' );
  } catch ( err ) {
    return res.status( 500 ).json( {
      error: err,
      message: "There has apperently been an error.",
      here
    } );
  }
} );

app.listen( port, () => {
  console.log( `Example app listening on port ${port}` );
} );
