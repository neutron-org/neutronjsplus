import { createDefaultAminoConverters } from '@cosmjs/stargate';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate';
import { cosmosAminoConverters } from '@neutron-org/neutronjs/cosmos/client';
import * as neutronContractmanagerTxAmino from '@neutron-org/neutronjs/neutron/contractmanager/tx.amino';
import * as neutronCronTxAmino from '@neutron-org/neutronjs/neutron/cron/tx.amino';
import * as neutronDexTxAmino from '@neutron-org/neutronjs/neutron/dex/tx.amino';
import * as neutronDynamicfeesV1TxAmino from '@neutron-org/neutronjs/neutron/dynamicfees/v1/tx.amino';
import * as neutronFeeburnerTxAmino from '@neutron-org/neutronjs/neutron/feeburner/tx.amino';
import * as neutronFeerefunderTxAmino from '@neutron-org/neutronjs/neutron/feerefunder/tx.amino';
import * as neutronHarpoonTxAmino from '@neutron-org/neutronjs/neutron/harpoon/tx.amino';
import * as neutronIbcratelimitV1beta1TxAmino from '@neutron-org/neutronjs/neutron/ibcratelimit/v1beta1/tx.amino';
import * as neutronInterchainqueriesTxAmino from '@neutron-org/neutronjs/neutron/interchainqueries/tx.amino';
import * as neutronInterchaintxsV1TxAmino from '@neutron-org/neutronjs/neutron/interchaintxs/v1/tx.amino';
import * as neutronRevenueTxAmino from '@neutron-org/neutronjs/neutron/revenue/tx.amino';
import { feemarketAminoConverters } from '@neutron-org/neutronjs/feemarket/client';
import { gaiaAminoConverters } from '@neutron-org/neutronjs/gaia/client';
import { osmosisAminoConverters } from '@neutron-org/neutronjs/osmosis/client';
import { sdkAminoConverters } from '@neutron-org/neutronjs/sdk/client';
import { slinkyAminoConverters } from '@neutron-org/neutronjs/slinky/client';
import * as neutronTransferV1TxAmino from '@neutron-org/neutronjs/neutron/transfer/v1/tx.amino';
import { neutronAminoConverters } from '@neutron-org/neutronjs/neutron/client';

export const aminoConverters = {
  ...createDefaultAminoConverters(),
  ...createWasmAminoConverters(),
  ...cosmosAminoConverters,
  ...neutronAminoConverters,
  // ...neutronContractmanagerTxAmino.AminoConverter,
  // ...neutronCronTxAmino.AminoConverter,
  // ...neutronDexTxAmino.AminoConverter,
  // ...neutronDynamicfeesV1TxAmino.AminoConverter,
  // ...neutronFeeburnerTxAmino.AminoConverter,
  // ...neutronFeerefunderTxAmino.AminoConverter,
  // ...neutronHarpoonTxAmino.AminoConverter,
  // ...neutronIbcratelimitV1beta1TxAmino.AminoConverter,
  // ...neutronInterchainqueriesTxAmino.AminoConverter,
  // ...neutronInterchaintxsV1TxAmino.AminoConverter,
  // ...neutronRevenueTxAmino.AminoConverter,
  // ...neutronTransferV1TxAmino.AminoConverter,
  ...feemarketAminoConverters,
  ...gaiaAminoConverters,
  ...osmosisAminoConverters,
  ...sdkAminoConverters,
  ...slinkyAminoConverters,
};
