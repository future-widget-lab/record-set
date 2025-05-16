import { limit } from '../limit/limit.helper';
import { skip } from '../skip/skip.helper';

type PageOptions<TRecord> = {
  pageNumber: number;
  pageSize: number;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to return an array containing the records corresponding to the given page number (1-based) and page size.
 *
 * This helper calculates the starting index by `(pageNumber - 1) * pageSize`, then skips that many records, and finally limits the result to `pageSize` number of records.
 *
 * If either `pageNumber` or `pageSize` is less than 1, this method returns an empty RecordSet.
 */
export const page = <TRecord>(
  options: PageOptions<TRecord>
): Array<TRecord> => {
  const { pageNumber, pageSize, records } = options;

  if (pageNumber < 1 || pageSize < 1) {
    return [];
  }

  const startIndex = (pageNumber - 1) * pageSize;

  return limit({
    count: pageSize,
    records: skip({ count: startIndex, records }),
  });
};
