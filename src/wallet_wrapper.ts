import Long from 'long';
import { ibc } from '@cosmos-client/ibc/cjs/proto';
import { Wallet, CodeId } from './types';
import { DEBUG_SUBMIT_TX, getContractBinary } from './env';
// import { MsgSubmitProposalLegacy } from '@neutron-org/cosmjs-types/'
// import { MsgAuctionBid } from './proto/block_sdk/sdk/auction/v1/tx_pb';
// import { ParameterChangeProposal } from './proto/cosmos_sdk/cosmos/params/v1beta1/params_pb';
// import { MsgRemoveInterchainQueryRequest } from './proto/neutron/neutron/interchainqueries/tx_pb';
import { MsgRemoveInterchainQueryRequest } from '@neutron-org/cosmjs-types/neutron/interchainqueries/tx';
import {
  IndexedTx,
  MsgSendEncodeObject,
  StdFee,
  defaultRegistryTypes,
} from '@cosmjs/stargate';
import {
  MigrateResult,
  SigningCosmWasmClient,
  wasmTypes,
} from '@cosmjs/cosmwasm-stargate';
import { MsgTransfer } from '@neutron-org/cosmjs-types/ibc/applications/transfer/v1/tx';

import IHeight = ibc.core.client.v1.IHeight;
import { Coin, EncodeObject, Registry } from '@cosmjs/proto-signing';
import { BalancesResponse, CosmosWrapper, NEUTRON_DENOM } from './cosmos';
import {
  MsgBurn,
  MsgChangeAdmin,
  MsgCreateDenom,
  MsgMint,
  MsgSetBeforeSendHook,
} from '@neutron-org/cosmjs-types/osmosis/tokenfactory/v1beta1/tx';
// import { TelescopeGeneratedType } from '@cosmjs/proto-signing/build/registry';

// constructor for WalletWrapper
export async function createWalletWrapper(
  chain: CosmosWrapper,
  wallet: Wallet,
) {
  const wasmClient = await SigningCosmWasmClient.connectWithSigner(
    chain.rpc,
    wallet.directwallet,
    {
      registry: new Registry([
        ...defaultRegistryTypes,
        ...wasmTypes,
        [MsgMint.typeUrl, MsgMint as any],
        [MsgCreateDenom.typeUrl, MsgCreateDenom as any],
        [MsgBurn.typeUrl, MsgBurn as any],
        [MsgChangeAdmin.typeUrl, MsgChangeAdmin as any],
        [MsgSetBeforeSendHook.typeUrl, MsgSetBeforeSendHook as any],
      ]),
    },
  );
  return new WalletWrapper(chain, wallet, wasmClient);
}

export class WalletWrapper {
  readonly chain: CosmosWrapper;
  readonly wallet: Wallet;
  readonly wasmClient: SigningCosmWasmClient;

  constructor(
    chain: CosmosWrapper,
    wallet: Wallet,
    wasmClient: SigningCosmWasmClient,
  ) {
    this.chain = chain;
    this.wallet = wallet;
    this.wasmClient = wasmClient;
  }

  async queryBalances(): Promise<BalancesResponse> {
    return await this.chain.queryBalances(this.wallet.address.toString());
  }

  async queryDenomBalance(denom: string): Promise<number> {
    return await this.chain.queryDenomBalance(
      this.wallet.address.toString(),
      denom,
    );
  }

  async execTx2(
    fee: StdFee | 'auto' | number,
    msgs: EncodeObject[],
    numAttempts = 10,
    memo?: string,
  ): Promise<IndexedTx> {
    memo ||= '';

    const result = await this.wasmClient.signAndBroadcast(
      this.wallet.address.toString(),
      msgs,
      fee,
      memo,
    );

    let error = null;
    // TODO: probably does not make sense because it already waits being in the block
    while (numAttempts > 0) {
      await this.chain.blockWaiter.waitBlocks(1);
      numAttempts--;
      const data = await this.wasmClient.getTx(result.transactionHash);
      if (data != null) {
        if (DEBUG_SUBMIT_TX) {
          const code = +data.code;
          console.log('response code: ', code);
          if (code > 0) {
            console.log('\x1b[31m error log: ', JSON.stringify(data.events));
          }
          console.log('response: ', JSON.stringify(data));
        }
        return data;
      }
    }
    error = error ?? new Error('failed to submit tx');

    throw error;
  }

  // storeWasm stores the wasm code by the passed path on the blockchain.
  async storeWasm(fileName: string): Promise<CodeId> {
    const sender = this.wallet.address.toString();
    const wasmCode = await getContractBinary(fileName);
    const res = await this.wasmClient.upload(sender, wasmCode, {
      amount: [{ denom: NEUTRON_DENOM, amount: '250000' }],
      gas: '60000000',
    });
    return res.codeId;
  }

  async instantiateContract(
    codeId: number,
    msg: any,
    label: string,
    admin: string = this.wallet.address.toString(),
  ): Promise<string> {
    const instantiateRes = await this.wasmClient.instantiate(
      this.wallet.address.toString(),
      codeId,
      msg,
      label,
      {
        amount: [{ denom: NEUTRON_DENOM, amount: '2000000' }],
        gas: '600000000',
      },
      { admin },
    );
    return instantiateRes.contractAddress;
  }

  async migrateContract(
    contract: string,
    codeId: number,
    msg: any,
  ): Promise<MigrateResult> {
    const sender = this.wallet.address.toString();
    const res = await this.wasmClient.migrate(sender, contract, codeId, msg, {
      gas: '5000000',
      amount: [{ denom: this.chain.denom, amount: '20000' }],
    });
    // TODO: throw error if unsuccessful?
    return res;
  }

  async executeContract(
    contract: string,
    msg: any,
    funds: Coin[] = [],
    fee = {
      gas: '4000000',
      amount: [{ denom: this.chain.denom, amount: '10000' }],
    },
  ): Promise<IndexedTx> {
    const sender = this.wallet.address.toString();
    const res = await this.wasmClient.execute(
      sender,
      contract,
      msg,
      fee,
      '',
      funds,
    );
    return await this.wasmClient.getTx(res.transactionHash);
  }

  /**
   * msgSend processes a transfer, waits two blocks and returns the tx hash.
   */
  async msgSend(
    to: string,
    coin:
      | {
          amount: string;
          denom?: string;
        }
      | string,
    fee = {
      gas_limit: Long.fromString('300000'),
      amount: [{ denom: this.chain.denom, amount: '1500' }],
    },
  ): Promise<IndexedTx> {
    const { amount, denom = this.chain.denom } =
      typeof coin === 'string' ? { amount: coin } : coin;
    const msgSendObject: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: this.wallet.address.toString(),
        toAddress: to,
        amount: [{ denom, amount }],
      },
    };

    const res = await this.execTx2(
      {
        amount: fee.amount,
        gas: fee.gas_limit + '',
      },
      [msgSendObject],
      10,
    );
    return res;
  }

  // TODO
  // async msgSendDirectProposal(
  //   subspace: string,
  //   key: string,
  //   value: string,
  //   fee = {
  //     gas: '200000',
  //     amount: [{ denom: this.chain.denom, amount: '1000' }],
  //   },
  // ): Promise<IndexedTx> {
  //   const value: MsgSubmitProposalLegacy = new {
  //     content: {
  //       typeUrl: '/cosmos.params.v1beta1.ParameterChangeProposal',
  //       value: new ParameterChangeProposal({
  //         title: 'mock',
  //         description: 'mock',
  //         changes: [
  //           new cosmosclient.proto.cosmos.params.v1beta1.ParamChange({ // TODO: remove cosmosclient
  //             key: key,
  //             subspace: subspace,
  //             value: value,
  //           }),
  //         ],
  //       }).toBinary(),
  //     },
  //     proposer: this.wallet.account.address,
  //   });
  //   const msg = {
  //     typeUrl: '',
  //     value
  //   };
  //   return await this.execTx2(
  //     fee,
  //     [msg],
  //   );
  // }

  // TODO
  // async msgSendAuction(
  //   bidder: string,
  //   bid: Coin,
  //   transactions: Uint8Array[],
  //   fee = {
  //     gas_limit: Long.fromString('200000'),
  //     amount: [{ denom: this.chain.denom, amount: '1000' }],
  //   },
  //   sequence: number = this.wallet.account.sequence,
  //   mode: cosmosclient.rest.tx.BroadcastTxMode = cosmosclient.rest.tx
  //     .BroadcastTxMode.Sync,
  // ): Promise<BroadcastTx200ResponseTxResponse> {
  //   const msg = new MsgAuctionBid({
  //     bidder,
  //     bid,
  //     transactions,
  //   });
  //   const currentHeight = await getHeight(this.chain.sdk);
  //   const res = await this.execTx(
  //     fee,
  //     [packAnyMsg('/sdk.auction.v1.MsgAuctionBid', msg)],
  //     10,
  //     mode,
  //     sequence,
  //     currentHeight + 1,
  //   );
  //   return res?.tx_response;
  // }

  /* simulateFeeBurning simulates fee burning via send tx.
   */
  async simulateFeeBurning(amount: number): Promise<IndexedTx> {
    const fee = {
      gas_limit: Long.fromString('200000'),
      amount: [
        {
          denom: this.chain.denom,
          amount: `${Math.ceil((1000 * amount) / 750)}`,
        },
      ],
    };

    return this.msgSend(
      this.wallet.address.toString(),
      { denom: this.chain.denom, amount: '1' },
      fee,
    );
  }

  /**
   * msgRemoveInterchainQuery sends transaction to remove interchain query, waits two blocks and returns the tx hash.
   */
  async msgRemoveInterchainQuery(
    queryId: bigint,
    sender: string,
  ): Promise<IndexedTx> {
    const value: MsgRemoveInterchainQueryRequest = {
      queryId: queryId,
      sender,
    };

    const msg = {
      typeUrl: MsgRemoveInterchainQueryRequest.typeUrl,
      value,
    };

    return await this.execTx2(
      {
        gas: '200000',
        amount: [{ denom: this.chain.denom, amount: '1000' }],
      },
      [msg],
    );
  }

  /**
   * msgIBCTransfer processes an IBC transfer, waits two blocks and returns the tx hash.
   */
  async msgIBCTransfer(
    sourcePort: string,
    sourceChannel: string,
    token: Coin,
    receiver: string,
    timeoutHeight: IHeight,
    memo?: string,
  ): Promise<IndexedTx> {
    const value: MsgTransfer = {
      sourcePort: sourcePort,
      sourceChannel: sourceChannel,
      token: token,
      sender: this.wallet.address.toString(),
      receiver: receiver,
      timeoutHeight: {
        revisionHeight: timeoutHeight.revision_height,
        revisionNumber: timeoutHeight.revision_number,
      },
      timeoutTimestamp: null,
      memo: memo,
    };

    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value,
    };

    const fee = {
      gas: '200000',
      amount: [{ denom: this.chain.denom, amount: '1000' }],
    };

    return await this.execTx2(fee, [msg]);
  }
}
