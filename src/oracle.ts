/**
 * @deprecated since version 0.5.0
 */
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

/**
 * @deprecated since version 0.5.0
 */
export type GetPricesResponse = {
  prices: GetPriceResponse[];
};

/**
 * @deprecated since version 0.5.0
 */
export type CurrencyPair = {
  Quote: string;
  Base: string;
};

/**
 * @deprecated since version 0.5.0
 */
export type GetAllCurrencyPairsResponse = {
  currency_pairs: CurrencyPair[];
};
