import { StreamingSocket } from '@cosmjs/socket';

global.WebSocket = require('ws');

export const waitSeconds = async (seconds: number) =>
  new Promise((r) => {
    setTimeout(() => r(true), 1000 * seconds);
  });

export class BlockWaiter {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  waitBlocks(n: number, timeout = 120000): Promise<void> {
    // const socket = new StreamingSocket(wsUrl + path, 3000);
    // socket.connect();
    // socket.events.subscribe();
    console.log('waitBlocks()');

    return new Promise((resolve, reject) => {
      let ws: StreamingSocket = null;
      const x = setTimeout(() => {
        if (ws != null) {
          ws.disconnect();
        }
        reject(new Error('waitBlocks: timeout'));
      }, timeout);
      ws = new StreamingSocket(this.url, timeout);
      ws.send(
        JSON.stringify({
          id: '1',
          jsonrpc: '2.0',
          method: 'subscribe',
          params: ["tm.event='NewBlock'"],
        }),
      );
      ws.events.subscribe({
        next: (res) => {
          console.log('socket.next()');
          if (Object.entries(res.data).length !== 0) {
            n--;
            if (n == 0) {
              ws.disconnect();
              clearTimeout(x);
              resolve();
            }
          }
        },
        error: () => {
          // TODO
          ws.disconnect();
          clearTimeout(x);
          resolve();
        },
        complete: () => {
          // TODO
          ws.disconnect();
          clearTimeout(x);
          resolve();
        },
      });
    });
  }
}

/**
 * getWithAttempts waits until readyFunc(getFunc()) returns true
 * and only then returns result of getFunc()
 */
export const getWithAttempts = async <T>(
  blockWaiter: BlockWaiter,
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
    await blockWaiter.waitBlocks(1);
  }
  throw error != null
    ? error
    : new Error(
        'getWithAttempts: no attempts left. Latest get response: ' +
          (data === Object(data) ? JSON.stringify(data) : data).toString(),
      );
};
