export const hasProtocol = ( uri ) => /^https?:\/\//gm.test( uri );

export const linkIsAbsolute = ( uri ) => /^https?:\/\/(?:\w+?\.){1,9}\w+\/?|^(?:\w+?\.){1,9}\w+\/?/gm.test( uri );

export const linkIsRelative = ( uri ) => !linkIsAbsolute( uri );

/**
 * @todo this will break if protocol is included. fix for that.
 * @param {string} uri
 * @param {string} domain 
 * @returns boolean
 */
export const linkIsLocal = ( uri, domain ) => {
  if ( linkIsRelative( uri ) ) return true;
  return new RegExp( `^${domain}` ).test( uri );
};

export const linkIsExternal = ( uri, domain ) => !linkIsLocal( uri, domain );

/**
 * What even is this logic here...
 * @todo fix this...
 * @param {string} u 
 * @returns boolean
 */
export const isUrl = ( u ) => {
  try {
    if ( linkIsAbsolute( u ) ) {
      new URL( u );
      return true;
    }
  } catch ( error ) {
    return false;
  }
  return false;
};

export const isNotUrl = ( u ) => !isUrl( u );

export const makeLinkAbsolute = ( link, domain ) => {
  if ( linkIsAbsolute( link ) ) return link;
  if ( ! /^\//.test( link ) ) link = '/' + link;
  return domain + link;
};

export const trimSlashes = ( url ) => url.replace( /^\/{2,}|\/+$/g, '' );

/**
 * 
 * @param {string} uri 
 * @returns {object} URL
 */
export const urlResolver = ( uri, hostname = null ) => {
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

export const extractFileUri = ( url ) => {
  if ( !url ) throw new Error( 'URL string must be provided!' );
  const reg = /[\w\:\/\.-]+\/([\w\.-]+?)\.css/gm;
  const fileUri = reg.exec( url )?.[1];
  if ( !fileUri ) return [
    null,
    new Error( 'Failed to extract URI.' )
  ];
  return [fileUri, null];
};