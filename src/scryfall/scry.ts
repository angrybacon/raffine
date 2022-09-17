import { getUrl } from '~/scryfall/api';
import { parse } from '~/scryfall/parse';

type Scry = (...queries: string[]) => Promise<unknown>;

export const scry: Scry = (...queries) => {
  let promises: Promise<unknown>[] = [];
  queries.forEach((query) => {
    const [name, set, number] = parse(query);
    const url = getUrl(name, set, number);
    const promise = fetch(url);
    promises.push(promise);
  });
  return Promise.allSettled(promises);
};
