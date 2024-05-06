export type ParamsResponse = {
  params: Params;
};

export type CurrencyPair = {
  base: string;
  quote: string;
};

export type GetLastUpdatedResponse = {
  last_updated: number;
};

export type GetMarketMapResponse = {
  // MarketMap defines the global set of market configurations for all providers
  // and markets.
  market_map: MarketMap;
  // LastUpdated is the last block height that the market map was updated.
  // This field can be used as an optimization for clients checking if there
  // is a new update to the map.
  last_updated: number;
  // Version is the schema version for the MarketMap data structure and query
  // response.
  version: number;
  // ChainId is the chain identifier for the market map.
  chain_id: string;
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
  market_authority: string;
};

export type MarketMap = {
  // Tickers is the full list of tickers and their associated configurations
  // to be stored on-chain.
  tickers: Map<string, Ticker>;
  // Paths is a map from CurrencyPair to all paths that resolve to that pair
  paths: Map<string, Paths>;
  // Providers is a map from CurrencyPair to each of to provider-specific
  // configs associated with it.
  providers: Map<string, Providers>;
  // AggregationType is the type of aggregation that will be used to aggregate
  // the prices of the tickers.
  aggregation_type: number;
};

export type Providers = {
  // Providers is the list of provider configurations for the given ticker.
  providers: ProviderConfig[];
};

export type ProviderConfig = {
  // Name corresponds to the name of the provider for which the configuration is
  // being set.
  name: string;
  // OffChainTicker is the off-chain representation of the ticker i.e. BTC/USD.
  // The off-chain ticker is unique to a given provider and is used to fetch the
  // price of the ticker from the provider.
  off_chain_ticker: string;
};

export type Paths = {
  // Paths is the list of convertable markets that will be used to convert the
  // prices of a set of tickers to a common ticker.
  paths: Path[];
};

export type Path = {
  // Operations is an ordered list of operations that will be taken. These must
  // be topologically sorted to ensure that the conversion is possible i.e. DAG.
  operations: Operation[];
};

export type Operation = {
  // CurrencyPair is the on-chain currency pair for this ticker.
  currency_pair: CurrencyPair;
  // Invert is a boolean that indicates whether the price of the ticker should
  // be inverted.
  invert: boolean;
  // Provider is the name of the provider that will be used to fetch the price
  // of the ticker.
  provider: string;
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
  metadata_json: string;
};
