import { ResourceLoader } from "jsdom";

export class CustomResourceLoader extends ResourceLoader {
  fetch ( url, options ) {
    if ( options.element ) {
      console.log( `Element ${options.element.localName} is requesting the url ${url}` );
    }

    return super.fetch( url, options );
  }
}