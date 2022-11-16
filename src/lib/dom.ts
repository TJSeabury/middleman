import { JSDOM, VirtualConsole } from "jsdom";
import { Result, Ok, Err } from "@sniptt/monads";
import { pipe } from "./general";


export function stripScripts(dom: JSDOM): JSDOM {
  try {
    const scripts = Array.from(dom.window.document.querySelectorAll('script'));
    for (const script of scripts) {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return dom;
}

export function stripStyles(dom: JSDOM): JSDOM {
  try {
    const styles = Array.from(dom.window.document.querySelectorAll('link[rel="stylesheet"],style'));
    for (const style of styles) {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }
  } catch (err) {
    console.error(err);
  }
  return dom;
}

export function stripScriptsAndStyles(dom: JSDOM): Result<JSDOM, Error> {
  let result: JSDOM | null = null;
  try {
    result = pipe<JSDOM>(
      dom,
      [
        stripStyles,
        stripScripts
      ]
    );
  } catch (err: any) {
    console.error(err);
    return Err(err);
  }
  return Ok(result);
}

export function extractDom(html: string): Result<JSDOM, Error> {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", (err) => {
    console.error(err);
  });

  let dom: JSDOM | null = null;
  try {
    dom = new JSDOM(html, {
      virtualConsole
    });
  } catch (err: any) {
    console.error(err);
    return Err(err);
  }
  return Ok(dom);
}