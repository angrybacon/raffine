import { getUrl } from '~/scryfall/api';
import { parse } from '~/scryfall/parse';
import { scry } from '~/scryfall/scry';

jest.mock('~/scryfall/api');
jest.mock('~/scryfall/parse');

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({}) } as Response)
);

describe(scry.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    (parse as jest.Mock).mockReturnValue([]);
  });

  it('should forge an URI with the appropriate parameters', async () => {
    // Given
    (parse as jest.Mock).mockReturnValueOnce(['One', 'S1', 1]);
    (parse as jest.Mock).mockReturnValueOnce(['Two', 'S2', 2]);
    // When
    await scry('Query1', 'Query2');
    // Then
    expect(parse).toHaveBeenCalledTimes(2);
    expect(parse).toHaveBeenCalledWith('Query1');
    expect(parse).toHaveBeenCalledWith('Query2');
    expect(getUrl).toHaveBeenCalledTimes(2);
    expect(getUrl).toHaveBeenCalledWith('One', 'S1', 1);
    expect(getUrl).toHaveBeenCalledWith('Two', 'S2', 2);
  });

  it('should request against the appropriate API', async () => {
    // Given
    (getUrl as jest.Mock).mockReturnValueOnce('API1');
    (getUrl as jest.Mock).mockReturnValueOnce('API2');
    // When
    await scry('', '');
    // Then
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith('API1');
    expect(global.fetch).toHaveBeenCalledWith('API2');
  });
});
