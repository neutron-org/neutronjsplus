import { AccountData, OfflineSigner } from '@cosmjs/proto-signing';
import { StdSignDoc } from '@cosmjs/amino/build/signdoc';

/**
 * Interface for EIP-191 signer
 */
export interface Eip191Signer {
  getAccounts(): Promise<readonly AccountData[]>;
  // Signs given signDoc using eip191 signature.
  // If you rename this function, fix isEip191Signer function as well.
  signEip191(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<{ signature: { signature: Buffer }; signed: any }>;
}
