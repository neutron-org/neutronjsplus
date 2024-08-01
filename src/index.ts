/*
This code should be inserted BEFORE all imports mostly for bip39 package.
Because in some cases it can not find crypto.getRandomValues in the global object
so this polyfill will fix it.
*/
import crypto from 'crypto';
if (typeof global === 'object' && !('crypto' in global)) {
  //@ts-ignore
  global.crypto = require('crypto');
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = getRandomValues;
}

function getRandomValues(array: any) {
  return (crypto.webcrypto as any).getRandomValues(array);
}

export * as constants from './constants';
export * as cosmos from './cosmos';
export * as dao from './dao';
export * as daoTypes from './dao_types';
export * as proposal from './proposal';
export * as types from './types';
export * as wait from './wait';
