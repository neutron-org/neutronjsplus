import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';

global.WebSocket = require('ws');

export const waitSeconds = async (seconds: number) =>
  new Promise((r) => {
    setTimeout(() => r(true), 1000 * seconds);
  });

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getWithAttempts = async <T>(
  client: StargateClient | CosmWasmClient,
  getFunc: () => Promise<T>,
  readyFunc: (t: T) => Promise<boolean>,
  numAttempts = 20,
): Promise<T> => {
  let error = null;
  let data: T;
  while (numAttempts > 0) {
    numAttempts--;
    try {
      data = await getFunc();
      if (await readyFunc(data)) {
        return data;
      }
    } catch (e) {
      error = e;
    }
    await waitBlocks(1, client);
  }
  throw error != null
    ? error
    : new Error(
        'getWithAttempts: no attempts left. Latest get response: ' +
          (data === Object(data) ? JSON.stringify(data) : data).toString(),
      );
};

export const waitBlocks = async (
  blocks: number,
  client: StargateClient | CosmWasmClient,
  timeout = 120000,
): Promise<void> => {
  const start = Date.now();
  // const client = await StargateClient.connect(this.rpc);
  const initBlock = await client.getBlock();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const block = await client.getBlock();
      if (block.header.height - initBlock.header.height >= blocks) {
        break;
      }
      if (Date.now() - start > timeout) {
        throw new Error('Timeout waiting for the specific block');
      }
    } catch (e) {
      //noop
    }
    await sleep(1000);
  }
};
