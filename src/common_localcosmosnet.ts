import { exec } from 'child_process';
import {
  COSMOS_DENOM,
  IBC_ATOM_DENOM,
  IBC_USDC_DENOM,
  mnemonicToWallet,
  NEUTRON_DENOM,
} from './cosmos';
import { BlockWaiter } from './wait';
import { generateMnemonic } from 'bip39';
import cosmosclient from '@cosmos-client/core';

import ICoin = cosmosclient.proto.cosmos.base.v1beta1.ICoin;
import { Wallet } from './types';
import { defaultRegistryTypes, SigningStargateClient } from '@cosmjs/stargate';
import { Registry } from '@cosmjs/proto-signing';

export const disconnectValidator = async (name: string) => {
  const { stdout } = exec(`docker stop ${name}`);
  return stdout;
};

const walletSet = async (
  sdk: cosmosclient.CosmosSDK,
  prefix: string,
  config: any,
): Promise<Record<string, Wallet>> => ({
  val1: await mnemonicToWallet(
    cosmosclient.ValAddress,
    sdk,
    config.VAL_MNEMONIC_1,
    prefix,
  ),
  demo1: await mnemonicToWallet(
    cosmosclient.AccAddress,
    sdk,
    config.DEMO_MNEMONIC_1,
    prefix,
  ),
  demo2: await mnemonicToWallet(
    cosmosclient.AccAddress,
    sdk,
    config.DEMO_MNEMONIC_2,
    prefix,
  ),
  icq: await mnemonicToWallet(
    cosmosclient.AccAddress,
    sdk,
    config.DEMO_MNEMONIC_3,
    prefix,
  ),
  rly1: await mnemonicToWallet(
    cosmosclient.AccAddress,
    sdk,
    config.RLY_MNEMONIC_1,
    prefix,
  ),
  rly2: await mnemonicToWallet(
    cosmosclient.AccAddress,
    sdk,
    config.RLY_MNEMONIC_2,
    prefix,
  ),
});

export class TestStateLocalCosmosTestNet {
  sdk1: cosmosclient.CosmosSDK;
  sdk2: cosmosclient.CosmosSDK;
  blockWaiter1: BlockWaiter;
  blockWaiter2: BlockWaiter;
  wallets: Record<string, Record<string, Wallet>>;
  icq_web_host: string;
  rpc1: string;
  rpc2: string;

  constructor(private config: any) {}

  async init() {
    const neutronPrefix = process.env.NEUTRON_ADDRESS_PREFIX || 'neutron';
    const cosmosPrefix = process.env.COSMOS_ADDRESS_PREFIX || 'cosmos';

    const host1 = process.env.NODE1_URL || 'http://localhost:1317';
    const host2 = process.env.NODE2_URL || 'http://localhost:1316';

    const rpcNeutron = process.env.NODE1_RPC || 'http://localhost:26657';
    const rpcGaia = process.env.NODE2_RPC || 'http://localhost:16657';

    this.rpc1 = rpcNeutron;
    this.rpc2 = rpcGaia;

    this.sdk1 = new cosmosclient.CosmosSDK(host1, this.config.CHAIN_ID_1);
    this.sdk2 = new cosmosclient.CosmosSDK(host2, this.config.CHAIN_ID_2);

    this.icq_web_host = 'http://localhost:9999';

    this.blockWaiter1 = new BlockWaiter(
      process.env.NODE1_WS_URL || 'ws://localhost:26657',
    );
    this.blockWaiter2 = new BlockWaiter(
      process.env.NODE2_WS_URL || 'ws://localhost:16657',
    );

    this.wallets = {};
    const neutron = await walletSet(this.sdk1, neutronPrefix, this.config);
    const cosmos = await walletSet(this.sdk2, cosmosPrefix, this.config);

    const qaNeutron = await this.createQaWallet(
      neutronPrefix,
      this.sdk1,
      neutron.demo1,
      NEUTRON_DENOM,
      rpcNeutron,
      [
        {
          denom: NEUTRON_DENOM,
          amount: '11500000000',
        },
        {
          denom: IBC_ATOM_DENOM,
          amount: '11500000000',
        },
        {
          denom: IBC_USDC_DENOM,
          amount: '11500000000',
        },
      ],
    );

    const qaNeutronThree = await this.createQaWallet(
      neutronPrefix,
      this.sdk1,
      neutron.demo1,
      NEUTRON_DENOM,
      rpcNeutron,
    );

    const qaNeutronFour = await this.createQaWallet(
      neutronPrefix,
      this.sdk1,
      neutron.demo1,
      NEUTRON_DENOM,
      rpcNeutron,
    );

    const qaNeutronFive = await this.createQaWallet(
      neutronPrefix,
      this.sdk1,
      neutron.demo1,
      NEUTRON_DENOM,
      rpcNeutron,
    );

    const qaCosmos = await this.createQaWallet(
      cosmosPrefix,
      this.sdk2,
      cosmos.demo2,
      COSMOS_DENOM,
      rpcGaia,
    );

    const qaCosmosTwo = await this.createQaWallet(
      cosmosPrefix,
      this.sdk2,
      cosmos.demo2,
      COSMOS_DENOM,
      rpcGaia,
    );

    this.wallets = {
      cosmos,
      neutron,
      qaNeutron,
      qaCosmos,
      qaCosmosTwo,
      qaNeutronThree,
      qaNeutronFour,
      qaNeutronFive,
    };
    return this.wallets;
  }

  async createQaWallet(
    prefix: string,
    sdk: cosmosclient.CosmosSDK,
    wallet: Wallet,
    denom: string,
    rpc: string,
    balances: ICoin[] = [],
  ) {
    if (balances.length === 0) {
      balances = [
        {
          denom,
          amount: '11500000000',
        },
      ];
    }

    const client = await SigningStargateClient.connectWithSigner(
      rpc,
      wallet.directwallet,
      { registry: new Registry(defaultRegistryTypes) },
    );
    const mnemonic = generateMnemonic();
    const newWallet = await mnemonicToWallet(
      cosmosclient.AccAddress,
      sdk,
      mnemonic,
      prefix,
      false,
    );
    for (const balance of balances) {
      await client.sendTokens(
        wallet.address.toString(),
        newWallet.address.toString(),
        [{ amount: balance.amount, denom: balance.denom }],
        {
          gas: '200000',
          amount: [{ denom: denom, amount: '1000' }],
        },
      );
    }
    const wal = await mnemonicToWallet(
      cosmosclient.AccAddress,
      sdk,
      mnemonic,
      prefix,
    );
    return { genQaWal1: wal };
  }
}
