import { Event as CosmosEvent } from '@cosmjs/stargate';
import { IndexedTx } from '@cosmjs/stargate';

export const getSequenceId = (tx: IndexedTx | undefined): number => {
  if (!tx) {
    throw 'getSequenceId: empty rawLog';
  }
  for (const event of tx.events) {
    if (event.type === 'send_packet') {
      const sequenceAttr = event.attributes.find(
        (attr) => attr.key === 'packet_sequence',
      );
      if (sequenceAttr) {
        return parseInt(sequenceAttr.value);
      }
    }
  }
};

export const createBankSendMessage = (
  addr: string,
  amount: number,
  denom: string,
) => ({
  bank: {
    send: {
      to_address: addr,
      amount: [
        {
          denom: denom,
          amount: amount.toString(),
        },
      ],
    },
  },
});

export const getEventAttribute = (
  events: readonly CosmosEvent[],
  eventType: string,
  attribute: string,
): string => {
  const attributes = events
    .filter((event) => event.type === eventType)
    .map((event) => event.attributes)
    .flat();

  const attrValue = attributes?.find((attr) => attr.key === attribute)
    ?.value as string;

  if (!attrValue) {
    throw new Error(`Attribute ${attribute} not found`);
  }

  return attrValue;
};
