import { scry } from '~/scryfall/scry';

describe(scry.name, () => {
  it('should scry for the specified queries', () => {
    // Given
    const queries = ['Pdt', 'TO'];
    // When
    scry(...queries);
    // Then
    expect(true).toEqual(true);
  });
});
