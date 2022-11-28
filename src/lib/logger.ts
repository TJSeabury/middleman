import type { FunctionVariadicAnyReturn } from "./typesAndInterfaces";
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export function _dirname(metaUrl: string): string {
  return dirname(fileURLToPath(metaUrl));
}

export function _filename(metaUrl: string): string {
  return fileURLToPath(metaUrl);
}

// Not working.
/* export function _getCallerFile() {
  const err = new Error();
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = err.stack as unknown as NodeJS.CallSite[];
  Error.prepareStackTrace = undefined;
  return stack[0].getFileName();
} */

export default function withLogger(f: FunctionVariadicAnyReturn, filename: string): FunctionVariadicAnyReturn {

  const {
    log,
    warn,
    error,
    dir,
  } = console;

  const writeError = (err: any) => {
    if (err != null) error(err);
  };

  const logPath = path.resolve('logs/log.txt');
  const warnPath = path.resolve('logs/warn.txt');
  const errorPath = path.resolve('logs/error.txt');

  return async (...args) => {
    console.log = (message?: any, ...optionalParams: any[]) => {
      // if (isNotProduction()) log(`Yeehaa, override! --[ ${message} ]--`);
      fs.appendFile(
        logPath,
        `<LOG>[${new Date().toUTCString()}]--{\n${message}\n}-- IN "${filename}"\n\n`,
        writeError
      );
    };

    console.warn = (message?: any, ...optionalParams: any[]) => {
      // if (isNotProduction()) warn(`Yeehaa, override! --[ ${message} ]--`);
      fs.appendFile(
        warnPath,
        `<WARN>[${new Date().toUTCString()}]--{\n${message}\n}-- IN "${filename}"\n\n`,
        writeError
      );
    };

    console.error = (message?: any, ...optionalParams: any[]) => {
      // if (isNotProduction()) error(`Yeehaa, override! --[ ${message} ]--`);
      fs.appendFile(
        errorPath,
        `<ERROR>[${new Date().toUTCString()}]--{\n${message}\n}-- IN "${filename}"\n\n`,
        writeError
      );
    };

    // We don't foresee this being very useful for logging.
    /* console.dir = (message?: any, ...optionalParams: any[]) => {
      // if (isNotProduction()) dir(`Yeehaa, override! --[ ${message} ]--`);
      fs.appendFile(
        logPath,
        `<DIR>[${new Date().toUTCString()}]--{ ${message} }-- IN "${filename}"\n`,
        writeError
      );
    }; */

    const result = await f(...args);

    console.log = log;
    console.warn = warn;
    console.error = error;
    //console.dir = dir;

    return result;
  };

};