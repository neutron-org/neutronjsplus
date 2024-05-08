# Neutron Helpers

[![npm version](https://badge.fury.io/js/@neutron-org%2Fneutronjsplus.svg)](https://badge.fury.io/js/@neutron-org%2Fneutronjsplus)

`@neutron-org/neutronjsplus` is an npm package designed to facilitate working with the Neutron blockchain and contracts. It includes a set of helpers and utilities that allow for quick and easy interaction with the Neutron Network.

## Installation

Install the package using npm:

```bash
npm install @neutron-org/neutronjsplus
```

or using yarn:

```bash
yarn add @neutron-org/neutronjsplus
```

## Features

- Contracts management;
- Sending and receiving transactions;
- Interaction with the Neutron blockchain, and much more.

## Version compatibility

| Neutron | Neutronjsplus |
|---------|---------------|
| < 2.0.0 | < 0.1.0       |
| 2.0.0   | 0.1.0         |

## Building protofiles

If need updated protofiles, they can be generated using yarn:

```bash
yarn proto
```

What this does is it clones all needed repos with protofiles we use and runs `buf` with ts plugin.
For exact code, see gen-proto.sh in root.

## Usage Example

```typescript
import {
    cosmosWrapper,
    walletWrapper,
    NEUTRON_DENOM,
} from '@neutron-org/neutronjsplus';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

const neutronChain = new cosmosWrapper.CosmosWrapper(
  NEUTRON_DENOM,
  'restendpoint',
  'rpcendpoint',
);

const directwallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: addrPrefix,
});

const account = (await directwallet.getAccounts())[0];

const directwalletValoper = await DirectSecp256k1HdWallet.fromMnemonic(
  mnemonic,
  {
    prefix: addrPrefix + 'valoper',
  },
);

const accountValoper = (await directwalletValoper.getAccounts())[0];

const neutronAccount = await walletWrapper.createWalletWrapper(
  neutronChain,
  new Wallet('addrPrefix', directwallet, account, accountValoper),
);

const res = await neutronAccount.msgSend('neutronaddress', '50000');
```

## License

`neutronjsplus` is distributed under the Apache-2.0 license. See the `LICENSE` file in the repository for details.
