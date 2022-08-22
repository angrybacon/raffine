import { CARDS } from '~/constants/Cards';
import { SETS } from '~/constants/Sets';

type ParseQuery = (query: string) => {
  name: string;
  number?: string;
  set?: string;
};

const parseQuery: ParseQuery = (query) => {
  const [name, set = '', number = ''] = query.split('|').map((it) => it.trim());
  const realName: string = CARDS[name] || name;
  const realSet: string | undefined = set || SETS[realName];
  return { name: realName, set: realSet.toLowerCase() };
};

type GetUrl = (name: string, set?: string, number?: string) => string;

const getUrl: GetUrl = (name, set, number) => {
  const base = 'https://api.scryfall.com';
  let path = '';
  let parameters = '';
  if (number && set) {
    path = `/${set}/${number}`;
  } else if (set) {
    path = '/named';
    parameters = new URLSearchParams({ exact: name, set }).toString();
  } else {
    path = '/search';
    parameters = new URLSearchParams({
      dir: 'asc',
      order: 'released',
      q: `!"${name}"`,
      unique: 'print',
    }).toString();
  }
  return `${base}${path}?${parameters}`;
};

type Scry = (...queries: string[]) => void;

export const scry: Scry = async (...queries) => {
  let promises: Promise<unknown>[] = [];
  queries.forEach((query) => {
    const { name, number, set } = parseQuery(query);
    const url = getUrl(name, set);
    const promise = fetch(url);
    promises.push(promise);
  });
  console.info('Fetching %s cards', promises.length);
  const response = await Promise.allSettled(promises);
  console.info(response);
};
