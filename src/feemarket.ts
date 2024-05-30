import axios from 'axios';
import { DecCoin } from './proto/neutron/cosmos/base/v1beta1/coin_pb';

export type GasPriceResponse = {
  price: DecCoin;
};

export type GasPricesResponse = {
  prices: Array<DecCoin>;
};

export type DynamicFeesRaparmsResponse = {
  params: DynamicFeesParams;
};

export type DynamicFeesParams = {
  ntrn_prices: Array<DecCoin>;
};

export const getGasPrice = async (
  sdkUrl: string,
  denom: string,
): Promise<GasPriceResponse> => {
  const res = await axios.get<GasPriceResponse>(
    `${sdkUrl}/feemarket/v1/gas_price/${denom}`,
  );

  return res.data;
};

export const getGasPrices = async (
  sdkUrl: string,
): Promise<GasPricesResponse> => {
  const res = await axios.get<GasPricesResponse>(
    `${sdkUrl}/feemarket/v1/gas_prices`,
  );

  return res.data;
};

export const getDynamicFeesRaparms = async (
  sdkUrl: string,
): Promise<DynamicFeesRaparmsResponse> => {
  const res = await axios.get<DynamicFeesRaparmsResponse>(
    `${sdkUrl}/neutron/dynamicfees/v1/params`,
  );

  return res.data;
};
