/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { WalletWrapper } from './walletWrapper';
import axios from 'axios';
import { IndexedTx } from '@cosmjs/stargate';
import {
  MsgMint,
  MsgBurn,
  MsgChangeAdmin,
  MsgCreateDenom,
  MsgSetBeforeSendHook,
} from '@neutron-org/cosmjs-types/osmosis/tokenfactory/v1beta1/tx';
import { Coin } from '@neutron-org/cosmjs-types/cosmos/base/v1beta1/coin';

export interface DenomsFromCreator {
  readonly denoms: readonly string[];
}

export interface AuthorityMetadata {
  readonly authority_metadata: { readonly Admin: string };
}

export interface BeforeSendHook {
  readonly contract_addr: string;
}

export const msgMintDenom = async (
  cmNeutron: WalletWrapper,
  creator: string,
  amount: Coin,
  mintToAddress = '',
  fee = {
    gas: '500000',
    amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
  },
): Promise<IndexedTx> => {
  const value: MsgMint = {
    sender: creator,
    amount,
    mintToAddress,
  };
  const msg = {
    typeUrl: MsgMint.typeUrl,
    value,
  };

  return await cmNeutron.execTx(fee, [msg]);
};

export const msgCreateDenom = async (
  cmNeutron: WalletWrapper,
  sender: string,
  subdenom: string,
  fee = {
    gas: '500000',
    amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
  },
): Promise<IndexedTx> => {
  const value: MsgCreateDenom = {
    sender,
    subdenom,
  };
  const msg = {
    typeUrl: MsgCreateDenom.typeUrl,
    value,
  };

  return await cmNeutron.execTx(fee, [msg]);
};

export const msgBurn = async (
  cmNeutron: WalletWrapper,
  sender: string,
  denom: string,
  amountToBurn: string,
  burnFromAddress = '',
  fee = {
    gas: '200000',
    amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
  },
): Promise<IndexedTx> => {
  const value: MsgBurn = {
    sender,
    amount: {
      denom: denom,
      amount: amountToBurn,
    },
    burnFromAddress,
  };
  const msg = {
    typeUrl: MsgBurn.typeUrl,
    value,
  };

  return await cmNeutron.execTx(fee, [msg]);
};

// Create MsgChangeAdmin message
export const msgChangeAdmin = async (
  cmNeutron: WalletWrapper,
  creator: string,
  denom: string,
  newAdmin: string,
): Promise<IndexedTx> => {
  const value: MsgChangeAdmin = {
    sender: creator,
    denom,
    newAdmin: newAdmin,
  };
  const msg = {
    typeUrl: MsgChangeAdmin.typeUrl,
    value,
  };
  const fee = {
    gas: '200000',
    amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
  };

  return await cmNeutron.execTx(fee, [msg]);
};

export const msgSetBeforeSendHook = async (
  cmNeutron: WalletWrapper,
  creator: string,
  denom: string,
  contractAddr: string,
): Promise<IndexedTx> => {
  const value: MsgSetBeforeSendHook = {
    sender: creator,
    denom,
    contractAddr: contractAddr,
  };
  const msg = {
    typeUrl: MsgSetBeforeSendHook.typeUrl,
    value,
  };
  const fee = {
    gas: '200000',
    amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
  };

  return await cmNeutron.execTx(fee, [msg]);
};

export const checkTokenfactoryParams = async (
  sdkUrl: string,
): Promise<boolean> => {
  try {
    await axios.get(`${sdkUrl}/osmosis/tokenfactory/v1beta1/params`);
    return true;
  } catch (e) {
    return false;
  }
};

export const getDenomsFromCreator = async (
  sdkUrl: string,
  creator: string,
): Promise<DenomsFromCreator> => {
  const res = await axios.get<DenomsFromCreator>(
    `${sdkUrl}/osmosis/tokenfactory/v1beta1/denoms_from_creator/${creator}`,
  );

  return res.data;
};

export const getAuthorityMetadata = async (
  sdkUrl: string,
  denom: string,
): Promise<AuthorityMetadata> => {
  const res = await axios.get<AuthorityMetadata>(
    `${sdkUrl}/osmosis/tokenfactory/v1beta1/denoms/${denom}/authority_metadata`,
  );

  return res.data;
};

export const getBeforeSendHook = async (
  sdkUrl: string,
  denom: string,
): Promise<BeforeSendHook> => {
  const res = await axios.get<BeforeSendHook>(
    `${sdkUrl}/osmosis/tokenfactory/v1beta1/denoms/${denom}/before_send_hook`,
  );

  return res.data;
};
