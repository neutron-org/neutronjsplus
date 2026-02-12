import {
  encodeSecp256k1Pubkey,
  OfflineAminoSigner,
  StdFee,
} from '@cosmjs/amino';
import { AminoTypes } from '@cosmjs/stargate';
import {
  EncodeObject,
  encodePubkey,
  makeAuthInfoBytes,
  makeSignDoc,
  OfflineDirectSigner,
  Registry,
  TxBodyEncodeObject,
} from '@cosmjs/proto-signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { makeSignDoc as makeSignDocAmino } from '@cosmjs/amino';
import { Int53 } from '@cosmjs/math';
import { fromBase64 } from '@cosmjs/encoding';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { Eip191Signer } from './eip191_signer';
import { Signer, SignerData } from './signing_neutron_client';
import { PubKey as EthPubKey } from '@neutron-org/neutronjs/neutron/crypto/v1beta1/ethsecp256k1/keys';

export class AminoSignerAdapter implements Signer {
  constructor(
    private signer: OfflineAminoSigner,
    private aminoTypes: AminoTypes,
    private registry: Registry,
  ) {}

  async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
    timeoutHeight?: bigint,
  ): Promise<TxRaw> {
    const pubkey = await this.getPubKey(signerAddress);
    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    const msgs = messages.map((msg) => this.aminoTypes.toAmino(msg));
    const signDoc = makeSignDocAmino(
      msgs,
      fee,
      chainId,
      memo,
      accountNumber,
      sequence,
      timeoutHeight,
    );
    const { signature, signed } = await (
      this.signer as OfflineAminoSigner
    ).signAmino(signerAddress, signDoc);
    const signedTxBody = {
      messages: signed.msgs.map((msg) => this.aminoTypes.fromAmino(msg)),
      memo: signed.memo,
      timeoutHeight: timeoutHeight,
    };
    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    };
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const signedSequence = Int53.fromString(signed.sequence).toNumber();
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence: signedSequence }],
      signed.fee.amount,
      signedGasLimit,
      signed.fee.granter,
      signed.fee.payer,
      signMode,
    );
    return TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }

  async getPubKey(signer: string): Promise<Any> {
    const accountFromSigner = (await this.signer.getAccounts()).find(
      (account) => account.address === signer,
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }

    return Promise.resolve(
      encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey)),
    );
  }
}

export class DirectSignerAdapter implements Signer {
  constructor(
    private signer: OfflineDirectSigner,
    private registry: Registry,
  ) {}

  async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
    timeoutHeight?: bigint,
  ): Promise<TxRaw> {
    const pubkey = await this.getPubKey(signerAddress);
    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: messages,
        memo: memo,
        timeoutHeight: timeoutHeight,
      },
    };
    const txBodyBytes = this.registry.encode(txBodyEncodeObject);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence }],
      fee.amount,
      gasLimit,
      fee.granter,
      fee.payer,
    );
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    );
    const { signature, signed } = await this.signer.signDirect(
      signerAddress,
      signDoc,
    );
    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }

  async getPubKey(signer: string): Promise<Any> {
    const accountFromSigner = (await this.signer.getAccounts()).find(
      (account) => account.address === signer,
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }

    return Promise.resolve(
      encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey)),
    );
  }
}

export class Eip191SignerAdapter implements Signer {
  constructor(
    private signer: Eip191Signer,
    private aminoTypes: AminoTypes,
    private registry: Registry,
  ) {}

  async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
    timeoutHeight?: bigint,
  ): Promise<TxRaw> {
    const pubkey = await this.getPubKey(signerAddress);
    const signMode = SignMode.SIGN_MODE_EIP_191;
    const msgs = messages.map((msg) => this.aminoTypes.toAmino(msg));
    const signDoc = makeSignDocAmino(
      msgs,
      fee,
      chainId,
      memo,
      accountNumber,
      sequence,
      timeoutHeight,
    );

    // Use the EIP-191 signer to sign the document
    const { signature, signed } = await this.signer.signEip191(
      signerAddress,
      signDoc,
    );

    const signedTxBody = {
      messages: signed.msgs.map((msg) => this.aminoTypes.fromAmino(msg)),
      memo: signed.memo,
      timeoutHeight: timeoutHeight,
    };
    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    };
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const signedSequence = Int53.fromString(signed.sequence).toNumber();
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence: signedSequence }],
      signed.fee.amount,
      signedGasLimit,
      signed.fee.granter,
      signed.fee.payer,
      signMode,
    );
    return TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [signature.signature],
    });
  }

  async getPubKey(signer: string): Promise<Any> {
    const accountFromSigner = (await this.signer.getAccounts()).find(
      (account) => account.address === signer,
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }

    return Any.fromPartial({
      typeUrl: EthPubKey.typeUrl,
      value: EthPubKey.encode({ key: accountFromSigner.pubkey }).finish(),
    });
  }
}
