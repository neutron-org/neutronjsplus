import axios, { AxiosResponse } from 'axios';
import { CosmosWrapper, WalletWrapper } from './cosmos';
import { getWithAttempts } from './wait';
import cosmosclient from '@cosmos-client/core';

/**
 * getRegisteredQuery queries the contract for a registered query details registered by the given
 * queryId.
 */
export const getRegisteredQuery = (
  cm: CosmosWrapper,
  contractAddress: string,
  queryId: number,
) =>
  cm.queryContract<{
    registered_query: {
      id: number;
      owner: string;
      keys: {
        path: string;
        key: string;
      }[];
      query_type: string;
      transactions_filter: string;
      connection_id: string;
      update_period: number;
      last_submitted_result_local_height: number;
      last_submitted_result_remote_height: {
        revision_number: number;
        revision_height: number;
      };
      deposit: { denom: string; amount: string }[];
      submit_timeout: number;
      registered_at_height: number;
    };
  }>(contractAddress, {
    get_registered_query: {
      query_id: queryId,
    },
  });

/**
 * waitForICQResultWithRemoteHeight waits until ICQ gets updated to
 * reflect data corresponding to remote height `>= targetHeight`
 */
export const waitForICQResultWithRemoteHeight = (
  cm: CosmosWrapper,
  contractAddress: string,
  queryId: number,
  targetHeight: number,
  numAttempts = 20,
) =>
  getWithAttempts(
    cm.blockWaiter,
    () => getRegisteredQuery(cm, contractAddress, queryId),
    async (query) =>
      query.registered_query.last_submitted_result_remote_height
        .revision_height >= targetHeight,
    numAttempts,
  );

/**
 * queryTransfersNumber queries the contract for recorded transfers number.
 */
export const queryTransfersNumber = (
  cm: CosmosWrapper,
  contractAddress: string,
) =>
  cm.queryContract<{
    transfers_number: number;
  }>(contractAddress, {
    get_transfers_number: {},
  });

/**
 * waitForTransfersAmount waits until contract has `expectedTransfersAmount`
 * number of incoming transfers stored.
 */
export const waitForTransfersAmount = (
  cm: CosmosWrapper,
  contractAddress: string,
  expectedTransfersAmount: number,
  numAttempts = 50,
) =>
  getWithAttempts(
    cm.blockWaiter,
    async () =>
      (await queryTransfersNumber(cm, contractAddress)).transfers_number,
    async (amount) => amount == expectedTransfersAmount,
    numAttempts,
  );

type UnsuccessfulSubmitIcqTx = {
  // QueryID is the query_id transactions was submitted for
  query_id: number;
  // SubmittedTxHash is the hash of the *remote fetched transaction* was submitted
  submitted_tx_hash: string;
  // NeutronHash is the hash of the *neutron chain transaction* which is responsible for delivering remote transaction to neutron
  neutron_hash: string;
  // ErrorTime is the time when the error was added
  error_time: string;
  // Status is the status of unsuccessful tx
  status: string;
  // Message is the more descriptive message for the error
  message: string;
};

export type ResubmitQuery = {
  query_id: number;
  hash: string;
};

export const getUnsuccessfulTxs = async (
  icqWebHost: string,
): Promise<Array<UnsuccessfulSubmitIcqTx>> => {
  const url = `${icqWebHost}/unsuccessful-txs`;
  const req = await axios.get<Array<UnsuccessfulSubmitIcqTx>>(url);
  return req.data;
};

export const postResubmitTxs = async (
  icqWebHost: string,
  txs: Array<ResubmitQuery>,
): Promise<AxiosResponse> => {
  const url = `${icqWebHost}/resubmit-txs`;
  const data = { txs: txs };
  return await axios.post(url, data);
};

/**
 * registerTransfersQuery sends a register_transfers_query execute msg to the contractAddress with
 * the given parameters and checks the tx result to be successful.
 */
export const registerTransfersQuery = async (
  cm: WalletWrapper,
  contractAddress: string,
  connectionId: string,
  updatePeriod: number,
  recipient: string,
) => {
  const res = await cm.executeContract(
    contractAddress,
    JSON.stringify({
      register_transfers_query: {
        connection_id: connectionId,
        update_period: updatePeriod,
        recipient: recipient,
      },
    }),
  );

  const tx = await cosmosclient.rest.tx.getTx(
    cm.chain.sdk as cosmosclient.CosmosSDK,
    res.txhash as string,
  );
  if (tx?.data.tx_response?.code != 0) {
    throw new Error('tx?.data.tx_response?.code != 0');
  }
};

/**
 * queryRecipientTxs queries the contract for recorded transfers to the given recipient address.
 */
export const queryRecipientTxs = (
  cm: CosmosWrapper,
  contractAddress: string,
  recipient: string,
) =>
  cm.queryContract<{
    transfers: [
      recipient: string,
      sender: string,
      denom: string,
      amount: string,
    ];
  }>(contractAddress, {
    get_recipient_txs: {
      recipient: recipient,
    },
  });
