export type ParamsResponse = {
  params: Params;
};

export type CurrencyPair = {
  base: string;
  quote: string;
};

export type LastUpdatedResponse = {
  last_updated: number;
};

export type MarketMapResponse = {
  // MarketMap defines the global set of market configurations for all providers
  // and markets.
  market_map: MarketMap;
  // LastUpdated is the last block height that the market map was updated.
  // This field can be used as an optimization for clients checking if there
  // is a new update to the map.
  last_updated: number;
  // ChainId is the chain identifier for the market map.
  chain_id: string;
};

export type MarketResponse = {
  market: Market;
};

export type QuotePrice = {
  price: string;
  // // BlockTimestamp tracks the block height associated with this price update.
  // // We include block timestamp alongside the price to ensure that smart
  // // contracts and applications are not utilizing stale oracle prices
  // block_timestamp: time.Time,
  // BlockHeight is height of block mentioned above
  block_height: number;
};

export type Params = {
  version: number;
  market_authorities: string[];
};

export type MarketMap = {
  markets: Map<string,Market>;
};

export type Market = {
  // Tickers is the full list of tickers and their associated configurations
  // to be stored on-chain.
  ticker: Ticker;
  // Providers is a map from CurrencyPair to each of to provider-specific
  // configs associated with it.
  provider_configs: Map<string, ProviderConfig>;
};

export type ProviderConfig = {
  // Name corresponds to the name of the provider for which the configuration is
  // being set.
  name: string;
  // OffChainTicker is the off-chain representation of the ticker i.e. BTC/USD.
  // The off-chain ticker is unique to a given provider and is used to fetch the
  // price of the ticker from the provider.
  off_chain_ticker: string;
  // NormalizeByPair is the currency pair for this ticker to be normalized by.
  // For example, if the desired Ticker is BTC/USD, this market could be reached
  // using: OffChainTicker = BTC/USDT NormalizeByPair = USDT/USD This field is
  // optional and nullable.
  normalize_by_pair: CurrencyPair,
  // Invert is a boolean indicating if the BASE and QUOTE of the market should
  // be inverted. i.e. BASE -> QUOTE, QUOTE -> BASE
  invert: boolean,
  // MetadataJSON is a string of JSON that encodes any extra configuration
  // for the given provider config.
  metadata_json: string,
};

export type Ticker = {
  // CurrencyPair is the currency pair for this ticker.
  currency_pair: CurrencyPair;
  // Decimals is the number of decimal places for the ticker. The number of
  // decimal places is used to convert the price to a human-readable format.
  decimals: number;
  // MinProviderCount is the minimum number of providers required to consider
  // the ticker valid.
  min_provider_count: number;
  // Enabled is the flag that denotes if the Ticker is enabled for price
  // fetching by an oracle.
  enabled: number;
  // MetadataJSON is a string of JSON that encodes any extra configuration
  // for the given ticker.
  metadata_JSON: string;
};
