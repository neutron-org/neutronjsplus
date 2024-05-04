/*
This code should be inserted BEFORE all imports mostly for bip39 package.
Because in some cases it can not find crypto.getRandomValues in the global object
so this polifill will fix it.
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

export * as tokenfactory from './tokenfactory';
export * as cosmosWrapper from './cosmos';
export * as walletWrapper from './wallet_wrapper';
export * as dao from './dao';
export * as env from './env';
export * as ica from './ica';
export * as icq from './icq';
export * as proposal from './proposal';
export * as tge from './tge';
export * as types from './types';
export * as wait from './wait';
export {
  NEUTRON_DENOM,
  IBC_ATOM_DENOM,
  IBC_USDC_DENOM,
  COSMOS_DENOM,
  IBC_RELAYER_NEUTRON_ADDRESS,
} from './cosmos';
