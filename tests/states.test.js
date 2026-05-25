import { describe, it, expect } from 'vitest';
import { STATE_ADJACENCY, getStateNeighbours, statesAreNeighbours, US_STATES } from '../src/data/states.js';

describe('US_STATES', () => {
  it('has 51 entries (50 states + DC)', () => {
    // Spec says 51 entries: 50 states + District of Columbia
    expect(US_STATES.length).toBe(51);
  });

  it('includes District of Columbia', () => {
    expect(US_STATES.includes('District of Columbia')).toBe(true);
    expect(STATE_ADJACENCY.has('District of Columbia')).toBe(true);
  });
});

describe('STATE_ADJACENCY', () => {
  it('is symmetric', () => {
    for (const [state, neighbours] of STATE_ADJACENCY) {
      for (const n of neighbours) {
        expect(STATE_ADJACENCY.get(n)?.has(state)).toBe(true);
      }
    }
  });
});

describe('statesAreNeighbours()', () => {
  it('California borders Oregon, Nevada, Arizona', () => {
    expect(statesAreNeighbours('California', 'Oregon')).toBe(true);
    expect(statesAreNeighbours('California', 'Nevada')).toBe(true);
    expect(statesAreNeighbours('California', 'Arizona')).toBe(true);
    expect(statesAreNeighbours('California', 'Texas')).toBe(false);
  });

  it('Florida borders Georgia and Alabama only', () => {
    expect(statesAreNeighbours('Florida', 'Georgia')).toBe(true);
    expect(statesAreNeighbours('Florida', 'Alabama')).toBe(true);
    expect(statesAreNeighbours('Florida', 'South Carolina')).toBe(false);
  });

  it('Hawaii bridges to California (island-nation sea link)', () => {
    const n = getStateNeighbours('Hawaii');
    expect(n.has('California')).toBe(true);
    expect(n.size).toBe(1);
  });

  it('Canada borders multiple states', () => {
    expect(statesAreNeighbours('Montana', 'Canada')).toBe(true);
    expect(statesAreNeighbours('Washington', 'Canada')).toBe(true);
  });
});
