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
| 3.0.0   | 0.3.0         |
| 4.0.0   | 0.5.0         |

## Usage Example
TODO

## License

`neutronjsplus` is distributed under the Apache-2.0 license. See the `LICENSE` file in the repository for details.

### Publishing

Publish a stable release as `latest`:

```sh
# package.json version: X.Y.Z
npm publish --access public --tag latest
```

Publish a release candidate as `next`:

```sh
# package.json version: X.Y.Z-rc.N
npm publish --access public --tag next
```

You can safely check the release content using

```sh
npm pack --dry-run 2>&1 | less
```