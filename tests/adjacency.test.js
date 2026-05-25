import { describe, it, expect } from 'vitest';
import { getNeighbours, areNeighbours, WORLD_ADJACENCY } from '../src/data/adjacency.js';

describe('WORLD_ADJACENCY', () => {
  it('has all major countries', () => {
    expect(WORLD_ADJACENCY.has('France')).toBe(true);
    expect(WORLD_ADJACENCY.has('Germany')).toBe(true);
    expect(WORLD_ADJACENCY.has('Russia')).toBe(true);
    expect(WORLD_ADJACENCY.has('Brazil')).toBe(true);
    expect(WORLD_ADJACENCY.has('China')).toBe(true);
  });

  it('includes special injections', () => {
    expect(WORLD_ADJACENCY.has('Kosovo')).toBe(true);
  });

  it('is symmetric', () => {
    for (const [country, neighbours] of WORLD_ADJACENCY) {
      for (const n of neighbours) {
        expect(WORLD_ADJACENCY.get(n)?.has(country)).toBe(true);
      }
    }
  });
});

describe('getNeighbours()', () => {
  it('returns correct neighbours for France', () => {
    const n = getNeighbours('France');
    expect(n.has('Germany')).toBe(true);
    expect(n.has('Spain')).toBe(true);
    expect(n.has('Italy')).toBe(true);
    expect(n.has('Belgium')).toBe(true);
    expect(n.has('Switzerland')).toBe(true);
  });

  it('does not include Bering Strait by default', () => {
    expect(getNeighbours('Russia').has('United States')).toBe(false);
  });

  it('includes Bering Strait when flag set', () => {
    expect(getNeighbours('Russia', { beringStrait: true }).has('United States')).toBe(true);
    expect(getNeighbours('United States', { beringStrait: true }).has('Russia')).toBe(true);
  });

  it('Kosovo borders Serbia, Albania, Montenegro, North Macedonia', () => {
    const n = getNeighbours('Kosovo');
    expect(n.has('Serbia')).toBe(true);
    expect(n.has('Albania')).toBe(true);
    expect(n.has('Montenegro')).toBe(true);
    expect(n.has('North Macedonia')).toBe(true);
  });
});

describe('areNeighbours()', () => {
  it('returns true for bordering countries', () => {
    expect(areNeighbours('France', 'Germany')).toBe(true);
    expect(areNeighbours('Brazil', 'Argentina')).toBe(true);
    expect(areNeighbours('India', 'China')).toBe(true);
  });

  it('returns false for non-bordering countries', () => {
    expect(areNeighbours('France', 'Japan')).toBe(false);
    expect(areNeighbours('Brazil', 'Ethiopia')).toBe(false);
  });

  it('island links: Japan borders South Korea and China', () => {
    expect(areNeighbours('Japan', 'South Korea')).toBe(true);
    expect(areNeighbours('Japan', 'China')).toBe(true);
  });

  it('UK borders France and Ireland', () => {
    expect(areNeighbours('United Kingdom', 'France')).toBe(true);
    expect(areNeighbours('United Kingdom', 'Ireland')).toBe(true);
  });

  it('Cuba borders United States and Mexico', () => {
    expect(areNeighbours('Cuba', 'United States')).toBe(true);
    expect(areNeighbours('Cuba', 'Mexico')).toBe(true);
  });

  it('Morocco borders Spain', () => {
    expect(areNeighbours('Morocco', 'Spain')).toBe(true);
  });
});
