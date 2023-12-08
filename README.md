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
    NEUTRON_DENOM,
    TestStateLocalCosmosTestNet,
} from '@neutron-org/neutronjsplus';

const config = require('./config.json');

const testState = new TestStateLocalCosmosTestNet(config);
 await testState.init();
const neutronChain = new cosmosWrapper.CosmosWrapper(
    testState.sdk1,
    testState.blockWaiter1,
    NEUTRON_DENOM,
);
neutronAccount = new cosmosWrapper.WalletWrapper(
    neutronChain,
    testState.wallets.qaNeutron.genQaWal1,
);
const res = await neutronAccount.msgSend('<blockchain account address>', '1000000');
console.log(res);
```

## License

`neutron-blockchain-helpers` is distributed under the Apache-2.0 license. See the `LICENSE` file in the repository for details.
