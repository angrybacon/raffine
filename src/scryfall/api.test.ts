import { getUrl } from '~/scryfall/api';

describe(getUrl.name, () => {
  describe('Queries with a name only', () => {
    it('should yield a correctly formed URI', () => {
      // When
      const url = getUrl('Predict');
      // Then
      const root = 'https://api.scryfall.com/search';
      const expected = `${root}?dir=asc&order=released&q=%21%22Predict%22&unique=print`;
      expect(url).toEqual(expected);
    });

    const tests: [name: string, escaped: string][] = [
      ["Sevinne's Reclamation", 'Sevinne%27s+Reclamation'],
      ['Pang Tong, "Young Phoenix"', 'Pang+Tong%2C+%22Young+Phoenix%22'],
      ['Circle of Protection: White', 'Circle+of+Protection%3A+White'],
      ['Kaboom!', 'Kaboom%21'],
      ['Minsc & Boo, Timeless Heroes', 'Minsc+%26+Boo%2C+Timeless+Heroes'],
    ];

    it.each(tests)('should escape special characters: %s', (name, escaped) => {
      // When
      const url = getUrl(name);
      // Then
      const root = 'https://api.scryfall.com/search';
      const expected = `${root}?dir=asc&order=released&q=%21%22${escaped}%22&unique=print`;
      expect(url).toEqual(expected);
    });
  });

  describe('Queries with a name and a set', () => {
    it('should yield a correctly formed URI', () => {
      // When
      const url = getUrl('Predict', 'SET');
      // Then
      const root = 'https://api.scryfall.com/named';
      const expected = `${root}?exact=Predict&set=SET`;
      expect(url).toEqual(expected);
    });
  });

  describe('Queries with a name, a set and a collector number', () => {
    it('should yield a correctly formed URI', () => {
      // When
      const url = getUrl('Predict', 'SET', 1234);
      // Then
      const root = 'https://api.scryfall.com';
      const expected = `${root}/SET/1234?`;
      expect(url).toEqual(expected);
    });
  });
});
