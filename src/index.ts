import crypto from 'crypto';

if (typeof global === 'object' && !('crypto' in global)) {
  global.crypto = crypto;
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = getRandomValues;

  console.log('absent getRandomValues');
  console.log(global.crypto);
}

function getRandomValues(array: any) {
  return (crypto.webcrypto as any).getRandomValues(array);
}

export * as tokenfactory from './helpers/tokenfactory';
export * as cosmosWrapper from './helpers/cosmos';
export * as dao from './helpers/dao';
export * as env from './helpers/env';
export * as ica from './helpers/ica';
export * as icq from './helpers/icq';
export * as proposal from './helpers/proposal';
export * as tge from './helpers/tge';
export * as types from './helpers/types';
export * as wait from './helpers/wait';
export { TestStateLocalCosmosTestNet } from './common_localcosmosnet';
