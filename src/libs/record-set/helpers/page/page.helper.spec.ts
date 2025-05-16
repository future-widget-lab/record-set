import { page } from './page.helper';

describe('Unit | Helper | page', () => {
  it('should exist', () => {
    expect(page).toBeDefined();
  });

  it('should return correct records for a valid page', () => {
    const records = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const page1 = page({ pageNumber: 1, pageSize: 3, records });
    expect(page1).toEqual([1, 2, 3]);

    const page2 = page({ pageNumber: 2, pageSize: 3, records });
    expect(page2).toEqual([4, 5, 6]);

    const page4 = page({ pageNumber: 4, pageSize: 3, records });
    expect(page4).toEqual([10]);
  });

  it('should return empty record set for invalid pageNumber or pageSize', () => {
    const records = [1, 2, 3];

    expect(page({ pageNumber: 0, pageSize: 3, records })).toEqual([]);
    expect(page({ pageNumber: 1, pageSize: 0, records })).toEqual([]);
    expect(page({ pageNumber: -5, pageSize: 2, records })).toEqual([]);
  });

  it('should return empty record set when page is out of range', () => {
    const records = [1, 2, 3];

    expect(page({ pageNumber: 10, pageSize: 3, records })).toEqual([]);
  });
});
