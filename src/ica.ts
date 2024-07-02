import { CosmosWrapper } from './cosmos';

// TODO: move to interchain tx tests
/**
 * @deprecated since version 0.5.0
 */
export const getIca = (
  cm: CosmosWrapper,
  contractAddress: string,
  icaId: string,
  connectionId: string,
  numAttempts = 20,
) =>
  cm.getWithAttempts(
    () =>
      cm.queryContract<{
        interchain_account_address: string;
      }>(contractAddress, {
        interchain_account_address: {
          interchain_account_id: icaId,
          connection_id: connectionId,
        },
      }),
    async (response) => response != null,
    numAttempts,
  );
