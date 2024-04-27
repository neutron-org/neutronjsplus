export type GetPriceResponse = {
  price: {
    price: string;
    block_timestamp: string;
    block_height: string;
  };
  nonce: string;
  decimals: string;
  id: string;
};

export type GetPricesResponse = {
  prices: GetPriceResponse[];
};

export type CurrencyPair = {
  Quote: string;
  Base: string;
};

export type GetAllCurrencyPairsResponse = {
  currency_pairs: CurrencyPair[];
};
