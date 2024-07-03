export type GasPriceResponse = {
  price: DecCoin;
};

export type GasPricesResponse = {
  prices: Array<DecCoin>;
};

export type FeeMarketParamsResponse = {
  params: FeeMarketParams;
};

export type FeeMarketParams = {
  // Alpha is the amount we additively increase the learning rate
  // when it is above or below the target +/- threshold.
  alpha: string; // Dec

  // Beta is the amount we multiplicatively decrease the learning rate
  // when it is within the target +/- threshold.
  beta: string; // Dec

  // Delta is the amount we additively increase/decrease the base fee when the
  // net block utilization difference in the window is above/below the target
  // utilization.
  delta: string; // Dec

  // MinBaseGasPrice determines the initial gas price of the module and the global
  // minimum for the network.
  min_base_gas_price: string; // Dec

  // MinLearningRate is the lower bound for the learning rate.
  min_learning_rate: string; // Dec

  // MaxLearningRate is the upper bound for the learning rate.
  max_learning_rate: string; // Dec

  // MaxBlockUtilization is the maximum block utilization.
  max_block_utilization: number;

  // Window defines the window size for calculating an adaptive learning rate
  // over a moving window of blocks.
  window: number;

  // FeeDenom is the denom that will be used for all fee payments.
  fee_denom: string;

  // Enabled is a boolean that determines whether the EIP1559 fee market is
  // enabled.
  enabled: boolean;

  // DistributeFees is a boolean that determines whether the fees are burned or
  // distributed to all stakers.
  distribute_fees: boolean;
};

export type DynamicFeesParamsResponse = {
  params: DynamicFeesParams;
};

export type DynamicFeesParams = {
  ntrn_prices: Array<DecCoin>;
};

export type DecCoin = {
  denom: string;
  amount: string;
};
