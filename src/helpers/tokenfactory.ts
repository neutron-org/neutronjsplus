/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/cjs/openapi/api';
import { WalletWrapper, packAnyMsg } from '../helpers/cosmos';
import Long from 'long';
import { MsgBurn, MsgChangeAdmin, MsgCreateDenom, MsgMint, MsgSetBeforeSendHook } from '../generated/neutron/osmosis/tokenfactory/v1beta1/tx_pb';
import axios from 'axios';
import cosmosclient from '@cosmos-client/core';
import ICoin = cosmosclient.proto.cosmos.base.v1beta1.ICoin;

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
  amount: ICoin,
): Promise<BroadcastTx200ResponseTxResponse> => {
  const msgMint = new MsgMint({
    sender: creator,
    amount,
  });
  const res = await cmNeutron.execTx(
    {
      gas_limit: Long.fromString('200000'),
      amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
    },
    [packAnyMsg('/osmosis.tokenfactory.v1beta1.MsgMint', msgMint)],
    10,
  );

  return res.tx_response!;
};

export const msgCreateDenom = async (
  cmNeutron: WalletWrapper,
  creator: string,
  subdenom: string,
): Promise<BroadcastTx200ResponseTxResponse> => {
  const msgCreateDenom = new MsgCreateDenom({
    sender: creator,
    subdenom,
  });
  const res = await cmNeutron.execTx(
    {
      gas_limit: Long.fromString('200000'),
      amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
    },
    [packAnyMsg('/osmosis.tokenfactory.v1beta1.MsgCreateDenom', msgCreateDenom)],
    10,
  );

  return res.tx_response!;
};

export const msgBurn = async (
  cmNeutron: WalletWrapper,
  creator: string,
  denom: string,
  amountToBurn: string,
): Promise<BroadcastTx200ResponseTxResponse> => {
  const msgBurn = new MsgBurn({
    sender: creator,
    amount: {
      denom: denom,
      amount: amountToBurn,
    },
  });
  const res = await cmNeutron.execTx(
    {
      gas_limit: Long.fromString('200000'),
      amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
    },
    [packAnyMsg('/osmosis.tokenfactory.v1beta1.MsgBurn',  msgBurn)],
    10,
  );

  return res.tx_response!;
};

// Create MsgChangeAdmin message
export const msgChangeAdmin = async (
  cmNeutron: WalletWrapper,
  creator: string,
  denom: string,
  newAdmin: string,
): Promise<BroadcastTx200ResponseTxResponse> => {
  const msgChangeAdmin = new MsgChangeAdmin({
    sender: creator,
    denom,
    newAdmin: newAdmin,
  });
  const res = await cmNeutron.execTx(
    {
      gas_limit: Long.fromString('200000'),
      amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
    },
    [packAnyMsg('/osmosis.tokenfactory.v1beta1.MsgChangeAdmin', msgChangeAdmin)],
    10,
  );

  return res.tx_response!;
};

export const msgSetBeforeSendHook = async (
  cmNeutron: WalletWrapper,
  creator: string,
  denom: string,
  contractAddr: string,
): Promise<BroadcastTx200ResponseTxResponse> => {
  const msgMint = new MsgSetBeforeSendHook({
    sender: creator,
    denom,
    contractAddr: contractAddr,
  });
  const res = await cmNeutron.execTx(
    {
      gas_limit: Long.fromString('200000'),
      amount: [{ denom: cmNeutron.chain.denom, amount: '1000' }],
    },
    [packAnyMsg('/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHook', msgMint)],
    10,
  );

  return res.tx_response!;
};


export const checkTokenfactoryParams = async (sdkUrl: string): Promise<boolean> => {
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

