import { select } from './select.helper';

describe('Unit | Helper | select', () => {
  it('should exist', () => {
    expect(select).toBeDefined();
  });

  it('should include specified fields via string', () => {
    type User = { id: number; name: string; age: number; flag?: boolean };

    const records: Array<User> = [
      { id: 1, name: 'A', age: 10, flag: true },
      { id: 2, name: 'B', age: 20, flag: false },
    ];

    const actual = select({ spec: 'id name', records });
    expect(actual).toEqual([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]);
  });

  it('should exclude specified fields via string', () => {
    type User = { id: number; name: string; age: number; flag?: boolean };

    const records: Array<User> = [
      { id: 1, name: 'A', age: 10, flag: true },
      { id: 2, name: 'B', age: 20, flag: false },
    ];

    const actual = select({ spec: '-age -flag', records });

    expect(actual).toEqual([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]);
  });

  it('should include fields via object notation', () => {
    type User = { id: number; name: string; age: number; flag?: boolean };

    const records: Array<User> = [
      { id: 1, name: 'A', age: 10, flag: true },
      { id: 2, name: 'B', age: 20, flag: false },
    ];

    const actual = select({ spec: { id: 1, age: 1 }, records });

    expect(actual).toEqual([
      { id: 1, age: 10 },
      { id: 2, age: 20 },
    ]);
  });

  it('should exclude fields via object notation', () => {
    type User = { id: number; name: string; age: number; flag?: boolean };

    const records: Array<User> = [
      { id: 1, name: 'A', age: 10, flag: true },
      { id: 2, name: 'B', age: 20, flag: false },
    ];

    const actual = select({ spec: { name: 0, flag: 0 }, records });

    expect(actual).toEqual([
      { id: 1, age: 10 },
      { id: 2, age: 20 },
    ]);
  });

  it('should treat "+" prefix as include', () => {
    type User = { id: number; name: string; age: number; flag?: boolean };

    const records: Array<User> = [
      { id: 1, name: 'A', age: 10, flag: true },
      { id: 2, name: 'B', age: 20, flag: false },
    ];

    const actual = select({ spec: '+flag', records });

    expect(actual).toEqual([{ flag: true }, { flag: false }]);
  });
});
