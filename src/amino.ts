import { createDefaultAminoConverters } from '@cosmjs/stargate';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate';
import { cosmosAminoConverters } from '@neutron-org/neutronjs/cosmos/client';
import { feemarketAminoConverters } from '@neutron-org/neutronjs/feemarket/client';
import { gaiaAminoConverters } from '@neutron-org/neutronjs/gaia/client';
import { osmosisAminoConverters } from '@neutron-org/neutronjs/osmosis/client';
import { sdkAminoConverters } from '@neutron-org/neutronjs/sdk/client';
import { slinkyAminoConverters } from '@neutron-org/neutronjs/slinky/client';
import { neutronAminoConverters } from '@neutron-org/neutronjs/neutron/client';

export const aminoConverters = {
  ...createDefaultAminoConverters(),
  ...createWasmAminoConverters(),
  ...cosmosAminoConverters,
  ...neutronAminoConverters,
  ...feemarketAminoConverters,
  ...gaiaAminoConverters,
  ...osmosisAminoConverters,
  ...sdkAminoConverters,
  ...slinkyAminoConverters,
};
