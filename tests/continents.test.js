import { describe, it, expect } from 'vitest';
import { CONTINENTS, getContinents, getContinent, DUAL_CONTINENT } from '../src/data/continents.js';

describe('CONTINENTS', () => {
  it('has correct count for Europe', () => {
    expect(CONTINENTS.Europe.size).toBeGreaterThanOrEqual(44);
  });

  it('has correct count for Africa', () => {
    expect(CONTINENTS.Africa.size).toBeGreaterThanOrEqual(54);
  });

  it('Kosovo is in Europe', () => {
    expect(CONTINENTS.Europe.has('Kosovo')).toBe(true);
  });

  it('Greenland is in North America', () => {
    expect(CONTINENTS['North America'].has('Greenland')).toBe(true);
  });

  it('French Guiana is in South America', () => {
    expect(CONTINENTS['South America'].has('French Guiana')).toBe(true);
  });
});

describe('DUAL_CONTINENT', () => {
  it('Russia is in both Europe and Asia', () => {
    expect(DUAL_CONTINENT.Russia).toContain('Europe');
    expect(DUAL_CONTINENT.Russia).toContain('Asia');
  });

  it('Turkey is in both Europe and Asia', () => {
    expect(DUAL_CONTINENT.Turkey).toContain('Europe');
    expect(DUAL_CONTINENT.Turkey).toContain('Asia');
  });
});

describe('getContinents()', () => {
  it('France is only in Europe', () => {
    expect(getContinents('France')).toEqual(['Europe']);
  });

  it('Russia is in Europe and Asia', () => {
    const c = getContinents('Russia');
    expect(c).toContain('Europe');
    expect(c).toContain('Asia');
  });
});

describe('getContinent()', () => {
  it('returns array of country names', () => {
    const europe = getContinent('Europe');
    expect(europe).toContain('France');
    expect(europe).toContain('Germany');
    expect(europe).toContain('Kosovo');
  });
});
