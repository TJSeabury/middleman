const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const Puppeteer = require( 'puppeteer' );
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

app.get( '/', async ( req, res ) => {
  try {
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

    return res.status( 200 ).json( body?.innerHTML || '' );
  } catch ( err ) {
    return res.status( 500 ).json( {
      error: err,
      message: "There has apperently been an error."
    } );
  }
} );

app.listen( port, () => {
  console.log( `Example app listening on port ${port}` );
} );
