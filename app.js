const fs = require( 'fs' );
const express = require( 'express' );
const cors = require( 'cors' );
const bodyParser = require( 'body-parser' );
const puppeteer = require( 'puppeteer' );
const {
  JSDOM,
  VirtualConsole,
} = require( 'jsdom' );

const btoa = ( str ) => Buffer.from( str, 'utf8' ).toString( 'base64' );
const atob = ( str ) => Buffer.from( str, 'base64' ).toString( 'utf8' );

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

app.use( cors() );

// support parsing of application/json type post data
//app.use( bodyParser.json() );
app.use( bodyParser.text() );

//support parsing of application/x-www-form-urlencoded post data
app.use( bodyParser.urlencoded( { extended: true } ) );

( async () => {
  // check if this even works on start.
  const browser = await puppeteer.launch();
  await browser.close();
} )();

function stripScripts ( dom ) {
  const scripts = Array.from( dom.window.document.querySelectorAll( 'script' ) );
  for ( const script of scripts ) {
    if ( script.parentNode ) {
      script.parentNode.removeChild( script );
    }
  }
  return dom;
}

function stripStyles ( dom ) {
  const styles = Array.from( dom.window.document.querySelectorAll( 'link[rel="stylesheet"],style' ) );
  for ( const style of styles ) {
    if ( style.parentNode ) {
      style.parentNode.removeChild( style );
    }
  }
  return dom;
}

function stripScriptsAndStyles ( dom ) {
  return stripStyles( stripScripts( dom ) );
}

async function extractDom ( page ) {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on( "error", () => { } ); // No-op to skip console errors.]

  const html = await page.content();

  return new JSDOM( html, {
    virtualConsole
  } );
}

/* ( async () => {
  
  const testResult = await test();
  fs.writeFileSync( './test-result.html', testResult );
} )(); */

app.get( '/', async ( req, res ) => {
  const url = req.query?.url;
  const [target, urlResolverErr] = urlResolver( url );
  if ( !target || urlResolverErr ) {
    return res.status( 422 ).json( 'Must provide a valid URL.' );
  }

  const browser = await puppeteer.launch( {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  } );
  const page = await browser.newPage();
  await page.goto( target, { waitUntil: 'networkidle0' } );

  const dom = extractDom( page );

  if ( !dom ) {
    return res.status( 500 ).json( 'Failed to create vDOM. :c' );
  }

  await browser.close();

  dom = stripScriptsAndStyles( dom );

  const body = dom.window.document.querySelector( 'body' );

  return res.status( 200 ).json( body?.innerHTML || '' );
} );


app.get( '/cornerstone-rates', async ( req, res ) => {
  //const url = 'https://consumer.optimalblue.com/FeaturedRates?GUID=b61565e4-69f1-4e5e-94cf-c9500181ed78';
  const url = req.query?.url;
  const [target, urlResolverErr] = urlResolver( url );
  if ( !target || urlResolverErr ) {
    return res.status( 422 ).json( 'Must provide a valid URL.' );
  }

  const browser = await puppeteer.launch( {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  } );
  const page = await browser.newPage();
  await page.goto( target, { waitUntil: 'networkidle0' } );

  // Click on all the 'links' and store the popup window doms at an attribute of that element.
  const links = await page.$$(
    'a[ng-click]'
  );
  for ( let i = 0, link = links[i]; i < links.length; ++i, link = links[i] ) {
    await link.click();
    const newPagePromise = new Promise( x => browser.once( 'targetcreated', target => x( target.page() ) ) );
    const popup = await newPagePromise;
    await popup.waitForNetworkIdle( { idleTime: 50 } );
    let dom = await extractDom( popup );
    dom = stripScriptsAndStyles( dom );
    let body = dom.window.document.querySelector( 'body' );
    body = body?.innerHTML?.trim() || '';
    body = btoa( body );
    await link.evaluate( ( a, html ) => a.setAttribute( 'data-html-b64', html ), body );
  }

  let dom = await extractDom( page );
  if ( !dom ) {
    return res.status( 500 ).json( 'Failed to create vDOM. :c' );
  }

  await browser.close();

  dom = stripScriptsAndStyles( dom );

  const body = dom.window.document.querySelector( 'body' );

  return res.status( 200 ).json( {
    html: body?.innerHTML || ''
  } );
} );


app.listen( port, () => {
  console.log( `Middleman listening on port ${port}` );
} );
