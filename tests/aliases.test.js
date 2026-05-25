import { describe, it, expect } from 'vitest';
import { normalise, resolveCountry, isUnplayable } from '../src/data/aliases.js';

const NAMES = [
  'Netherlands', 'United States', 'United Kingdom', 'United Arab Emirates',
  "Côte d'Ivoire", 'Czech Republic', 'Myanmar', 'Eswatini', 'Timor-Leste',
  'Turkey', 'Ireland', 'Cape Verde', 'Iran', 'Greece', 'Taiwan', 'Thailand',
  'Cambodia', 'Ethiopia', 'Zimbabwe', 'Tanzania', 'Democratic Republic of the Congo',
  'Republic of the Congo', 'Bosnia and Herzegovina', 'North Macedonia',
  'Trinidad and Tobago', 'Gambia', 'Saudi Arabia', 'Papua New Guinea',
  'Central African Republic', 'Belarus', 'Suriname', 'Kyrgyzstan', 'Kosovo',
];

describe('normalise()', () => {
  it('lowercases and strips diacritics', () => {
    expect(normalise('Côte d\'Ivoire')).toBe("cote d'ivoire");
    expect(normalise('  Greece  ')).toBe('greece');
    expect(normalise('Türkiye')).toBe('turkiye');
  });
});

describe('resolveCountry()', () => {
  it('resolves exact matches', () => {
    expect(resolveCountry('Netherlands', NAMES)).toBe('Netherlands');
    expect(resolveCountry('Greece', NAMES)).toBe('Greece');
  });

  it('resolves case-insensitive', () => {
    expect(resolveCountry('netherlands', NAMES)).toBe('Netherlands');
    expect(resolveCountry('GREECE', NAMES)).toBe('Greece');
  });

  it('resolves aliases', () => {
    expect(resolveCountry('Holland', NAMES)).toBe('Netherlands');
    expect(resolveCountry('USA', NAMES)).toBe('United States');
    expect(resolveCountry('UK', NAMES)).toBe('United Kingdom');
    expect(resolveCountry('UAE', NAMES)).toBe('United Arab Emirates');
    expect(resolveCountry('Ivory Coast', NAMES)).toBe("Côte d'Ivoire");
    expect(resolveCountry('Czechia', NAMES)).toBe('Czech Republic');
    expect(resolveCountry('Burma', NAMES)).toBe('Myanmar');
    expect(resolveCountry('Swaziland', NAMES)).toBe('Eswatini');
    expect(resolveCountry('East Timor', NAMES)).toBe('Timor-Leste');
    expect(resolveCountry('Turkiye', NAMES)).toBe('Turkey');
    expect(resolveCountry('Eire', NAMES)).toBe('Ireland');
    expect(resolveCountry('Cabo Verde', NAMES)).toBe('Cape Verde');
    expect(resolveCountry('Persia', NAMES)).toBe('Iran');
    expect(resolveCountry('Hellas', NAMES)).toBe('Greece');
    expect(resolveCountry('Formosa', NAMES)).toBe('Taiwan');
    expect(resolveCountry('Siam', NAMES)).toBe('Thailand');
    expect(resolveCountry('Kampuchea', NAMES)).toBe('Cambodia');
    expect(resolveCountry('Abyssinia', NAMES)).toBe('Ethiopia');
    expect(resolveCountry('Rhodesia', NAMES)).toBe('Zimbabwe');
    expect(resolveCountry('Tanganyika', NAMES)).toBe('Tanzania');
    expect(resolveCountry('DRC', NAMES)).toBe('Democratic Republic of the Congo');
    expect(resolveCountry('Bosnia', NAMES)).toBe('Bosnia and Herzegovina');
    expect(resolveCountry('The Gambia', NAMES)).toBe('Gambia');
    expect(resolveCountry('PNG', NAMES)).toBe('Papua New Guinea');
    expect(resolveCountry('DRC', NAMES)).toBe('Democratic Republic of the Congo');
  });

  it('returns null for unknown names', () => {
    expect(resolveCountry('Narnia', NAMES)).toBeNull();
    expect(resolveCountry('', NAMES)).toBeNull();
  });
});

describe('isUnplayable()', () => {
  it('flags unplayable countries', () => {
    expect(isUnplayable('Gibraltar')).toBe(true);
    expect(isUnplayable('Nauru')).toBe(true);
    expect(isUnplayable('Tuvalu')).toBe(true);
  });

  it('does not flag playable countries', () => {
    expect(isUnplayable('France')).toBe(false);
    expect(isUnplayable('Nigeria')).toBe(false);
  });
});
