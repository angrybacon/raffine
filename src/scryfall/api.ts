type GetUrl = (name: string, set?: string, number?: number) => string;

export const getUrl: GetUrl = (name, set, number) => {
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
