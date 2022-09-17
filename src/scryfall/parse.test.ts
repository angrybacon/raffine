import * as CONSTANTS_CARDS from '~/constants/Cards';
import * as CONSTANTS_SETS from '~/constants/Sets';
import { parse } from '~/scryfall/parse';

describe(parse.name, () => {
  beforeEach(() => {
    // @ts-expect-error The constant is read-only
    CONSTANTS_CARDS.CARDS = {};
    // @ts-expect-error The constant is read-only
    CONSTANTS_SETS.SETS = {};
  });

  describe('With a name only', () => {
    it('should parse the name', () => {
      // When
      const result = parse('  Force  of  Will  ');
      // Then
      expect(result).toEqual(['FORCE  OF  WILL', undefined, undefined]);
    });

    it('should parse a known acronym', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_CARDS.CARDS = { FoW: 'Force of Will' };
      // When
      const result = parse('  FoW  ');
      // Then
      expect(result).toEqual(['FORCE OF WILL', undefined, undefined]);
    });

    it('should return the provided acronym when it is not known', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_CARDS.CARDS = {};
      // When
      const result = parse('  FoW  ');
      // Then
      expect(result).toEqual(['FOW', undefined, undefined]);
    });

    it('should be case-sensitive', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_CARDS.CARDS = { FoW: 'Force of Will' };
      // When
      const result = parse('fow');
      // Then
      expect(result).toEqual(['FOW', undefined, undefined]);
    });

    it('should throw when the name is missing', () => {
      // When
      const tester = () => parse('  ');
      // Then
      expect(tester).toThrow(/missing name/i);
    });
  });

  describe('With a name and a set', () => {
    it('should parse the set', () => {
      // When
      const result = parse('  Force  of  Will  |  SET  ');
      // Then
      expect(result).toEqual(['FORCE  OF  WILL', 'SET', undefined]);
    });

    it('should parse the set with no space', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_CARDS.CARDS = { FoW: 'Force of Will' };
      // When
      const result = parse('Force of Will|SET');
      // Then
      expect(result).toEqual(['FORCE OF WILL', 'SET', undefined]);
    });

    it('should return the default set for the specified card', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_SETS.SETS = { 'Force of Will': 'DEFAULT' };
      // When
      const result = parse('Force of Will');
      // Then
      expect(result).toEqual(['FORCE OF WILL', 'DEFAULT', undefined]);
    });

    it('should be space-sensitive', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_SETS.SETS = { 'Force of Will': 'DEFAULT' };
      // When
      const result = parse('  Force  of  Will  ');
      // Then
      expect(result).toEqual(['FORCE  OF  WILL', undefined, undefined]);
    });

    it('should accept card shorthands', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_CARDS.CARDS = { FoW: 'Force of Will' };
      // @ts-expect-error The constant is read-only
      CONSTANTS_SETS.SETS = { 'Force of Will': 'DEFAULT' };
      // When
      const result = parse('FoW');
      // Then
      expect(result).toEqual(['FORCE OF WILL', 'DEFAULT', undefined]);
    });

    it('should allow overwrites for the set', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_SETS.SETS = { 'Force of Will': 'DEFAULT' };
      // When
      const result = parse('Force of Will | CUSTOM');
      // Then
      expect(result).toEqual(['FORCE OF WILL', 'CUSTOM', undefined]);
    });

    it('should allow overwrites for the set with card shorthands', () => {
      // Given
      // @ts-expect-error The constant is read-only
      CONSTANTS_CARDS.CARDS = { FoW: 'Force of Will' };
      // @ts-expect-error The constant is read-only
      CONSTANTS_SETS.SETS = { 'Force of Will': 'DEFAULT' };
      // When
      const result = parse('FoW | CUSTOM');
      // Then
      expect(result).toEqual(['FORCE OF WILL', 'CUSTOM', undefined]);
    });

    it('should throw when the name is missing', () => {
      // When
      const tester = () => parse(' | SET');
      // Then
      expect(tester).toThrow(/missing name/i);
    });

    it('should throw when the set is missing', () => {
      // When
      const tester = () => parse('Force of Will | ');
      // Then
      expect(tester).toThrow(/missing set/i);
    });

    it('should throw when the name and set are missing', () => {
      // When
      const tester = () => parse(' | ');
      // Then
      expect(tester).toThrow(/missing name/i);
    });
  });

  describe('With a name, a set and a collector number', () => {
    it('should parse the number', () => {
      // When
      const result = parse('  Force  of  Will  |  SET  |  1234  ');
      // Then
      expect(result).toEqual(['FORCE  OF  WILL', 'SET', 1234]);
    });

    it('should parse the number with no space', () => {
      // When
      const result = parse('Force of Will | SET|1234');
      // Then
      expect(result).toEqual(['FORCE OF WILL', 'SET', 1234]);
    });

    it('should throw when the provided number cannot be parsed', () => {
      // When
      const tester = () => parse('Force of Will | SET | ABCD');
      // Then
      expect(tester).toThrow(/missing number/i);
    });

    it('should handle partially invalid numbers', () => {
      // When
      const result = parse('Force of Will | SET | 12AB');
      // Then
      expect(result).toEqual(['FORCE OF WILL', 'SET', 12]);
    });

    it('should throw when the name is missing', () => {
      // When
      const tester = () => parse(' | SET | 1234');
      // Then
      expect(tester).toThrow(/missing name/i);
    });

    it('should throw when the set is missing', () => {
      // When
      const tester = () => parse('Force of Will | | 1234');
      // Then
      expect(tester).toThrow(/missing set/i);
    });

    it('should throw when the number is missing', () => {
      // When
      const tester = () => parse('Force of Will | SET | ');
      // Then
      expect(tester).toThrow(/missing number/i);
    });

    it('should throw when the name and set are missing', () => {
      // When
      const tester = () => parse(' | | 1234');
      // Then
      expect(tester).toThrow(/missing name/i);
    });

    it('should throw when the name and number are missing', () => {
      // When
      const tester = () => parse(' | SET | ');
      // Then
      expect(tester).toThrow(/missing name/i);
    });

    it('should throw when the set and number are missing', () => {
      // When
      const tester = () => parse('Force of Will | | ');
      // Then
      expect(tester).toThrow(/missing set/i);
    });

    it('should throw when the name, set and number are missing', () => {
      // When
      const tester = () => parse(' | | ');
      // Then
      expect(tester).toThrow(/missing name/i);
    });
  });
});
