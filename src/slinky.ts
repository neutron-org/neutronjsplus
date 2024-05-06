

export type ParamsResponse = {
  params: Params;
};


export type GetPriceResponse  = {
  // QuotePrice represents the quote-price for the CurrencyPair given in
  // GetPriceRequest (possibly nil if no update has been made)
  price: QuotePrice;
  // nonce represents the nonce for the CurrencyPair if it exists in state
  nonce: number;
  // decimals represents the number of decimals that the quote-price is
  // represented in. For Pairs where ETHEREUM is the quote this will be 18,
  // otherwise it will be 8.
  decimals: number;
  // ID represents the identifier for the CurrencyPair.
  id: number;
}


export type GetPricesResponse = {
  prices: GetPriceResponse[],
}

export type GetAllCurrencyPairsResponse = {
  currency_pairs: CurrencyPair[],
}

export type CurrencyPair = {
  base: string,
  quote: string,
}


export type QuotePrice ={
  price: string;
    // // BlockTimestamp tracks the block height associated with this price update.
    // // We include block timestamp alongside the price to ensure that smart
    // // contracts and applications are not utilizing stale oracle prices
    // block_timestamp: time.Time,
    // BlockHeight is height of block mentioned above
 block_height: number,
}

export type Params = {
  version: number;
  market_authority: string;
}


export type MarketMap  ={
  // Tickers is the full list of tickers and their associated configurations
  // to be stored on-chain.
  tickers: Map<String, Ticker>;
    // Paths is a map from CurrencyPair to all paths that resolve to that pair
  paths: Map<String, Paths>;
    // Providers is a map from CurrencyPair to each of to provider-specific
    // configs associated with it.
  providers: Map<String, Providers>;
    // AggregationType is the type of aggregation that will be used to aggregate
    // the prices of the tickers.
  aggregation_type: number;
}


export type Providers = {
  // Providers is the list of provider configurations for the given ticker.
  providers: ProviderConfig[];
}


export type ProviderConfig = {
  // Name corresponds to the name of the provider for which the configuration is
  // being set.
  name: string;
  // OffChainTicker is the off-chain representation of the ticker i.e. BTC/USD.
  // The off-chain ticker is unique to a given provider and is used to fetch the
  // price of the ticker from the provider.
  off_chain_ticker: string;
}

export type Paths = {
  // Paths is the list of convertable markets that will be used to convert the
  // prices of a set of tickers to a common ticker.
  paths: Path[];
}


export type Path = {
  // Operations is an ordered list of operations that will be taken. These must
  // be topologically sorted to ensure that the conversion is possible i.e. DAG.
  operations: Operation[];
}

export type Operation = {
  // CurrencyPair is the on-chain currency pair for this ticker.
  currency_pair: CurrencyPair;
    // Invert is a boolean that indicates whether the price of the ticker should
    // be inverted.
  invert: boolean;
    // Provider is the name of the provider that will be used to fetch the price
    // of the ticker.
  provider: string;
}


export type Ticker = {
  // CurrencyPair is the currency pair for this ticker.
  currency_pair: CurrencyPair,
    // Decimals is the number of decimal places for the ticker. The number of
    // decimal places is used to convert the price to a human-readable format.
  decimals: number,
    // MinProviderCount is the minimum number of providers required to consider
    // the ticker valid.
  min_provider_count: number,
    // Enabled is the flag that denotes if the Ticker is enabled for price
    // fetching by an oracle.
  enabled: number,
    // MetadataJSON is a string of JSON that encodes any extra configuration
    // for the given ticker.
  metadata_json: string,
}
