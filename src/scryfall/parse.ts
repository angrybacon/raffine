import { CARDS } from '~/constants/Cards';
import { SETS } from '~/constants/Sets';

type Parse = (query: string) => [name: string, set?: string, number?: number];

export const parse: Parse = (query) => {
  const [name, set, number] = query.split('|').map((it) => it.trim());

  const realName = (CARDS[name] || name) as string;
  if (!realName) {
    throw new Error('Missing name');
  }

  const realSet = (set || SETS[realName]) as string | undefined;
  if (set !== undefined && !realSet) {
    throw new Error('Missing set');
  }

  const realNumber = parseInt(number) || undefined;
  if (number !== undefined && realNumber === undefined) {
    throw new Error('Missing number');
  }

  return [realName.toUpperCase(), realSet?.toUpperCase(), realNumber];
};
