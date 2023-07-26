/* 
This code should be inserted BEFORE all imports mostly for bip39 package.
Because in some cases it can not find crypto.getRandomValues in the global object
so this polifill will fix it.
*/
import crypto from 'crypto';
if (typeof global === 'object' && !('crypto' in global)) {
  global.crypto = crypto;
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = getRandomValues;
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
export {
  NEUTRON_DENOM,
  IBC_ATOM_DENOM,
  IBC_USDC_DENOM,
  COSMOS_DENOM,
  IBC_RELAYER_NEUTRON_ADDRESS,
} from './helpers/cosmos';
