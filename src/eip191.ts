import { AccountData, OfflineSigner } from '@cosmjs/proto-signing';
import { StdSignDoc } from '@cosmjs/amino/build/signdoc';

/**
 * Interface for EIP-191 signer
 */
export interface Eip191Signer {
  getAccounts(): Promise<readonly AccountData[]>;
  signEip191(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<{ signature: { signature: Buffer }; signed: any }>;
}

/**
 * Type guard to check if a signer is an EIP-191 signer
 */
export function isEip191Signer(
  signer: OfflineSigner | Eip191Signer,
): signer is OfflineSigner | Eip191Signer {
  return 'signEip191' in signer;
}

// TODO: do we need this in here?
// import { SDKProvider } from '@metamask/sdk';
//
// // Metamask implementation of Eip191 signer
// export class MetamaskEip191Signer implements Eip191Signer {
//   constructor(private readonly ext: SDKProvider) {
//     // TODO
//   }
//
//   getAccounts(): Promise<readonly AccountData[]> {
//     // TODO
//     throw new Error('Method not implemented.');
//   }
//   signEip191(
//     _signerAddress: string,
//     _signDoc: StdSignDoc,
//   ): Promise<{ signature: { signature: Buffer }; signed: any }> {
//     // TODO
//     throw new Error('Method not implemented.');
//   }
// }
