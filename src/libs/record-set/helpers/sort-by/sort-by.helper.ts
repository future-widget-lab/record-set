import orderBy from 'lodash.orderby';

type SortByOptions<TRecord> = {
  iteratees: Array<keyof TRecord> | keyof TRecord;
  orders?: Array<'asc' | 'desc'> | 'asc' | 'desc';
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to sort the records by key(s) using lodash orderBy.
 */
export const sortBy = <TRecord>(
  options: SortByOptions<TRecord>
): Array<TRecord> => {
  const { iteratees, orders, records } = options;

  const keys = Array.isArray(iteratees)
    ? iteratees.map(String)
    : [String(iteratees)];

  const ords =
    orders === undefined
      ? keys.map(() => 'asc')
      : Array.isArray(orders)
      ? orders
      : [orders];

  const sorted = orderBy(
    records,
    keys as (keyof TRecord & string)[],
    ords as Array<'asc' | 'desc'>
  );

  return sorted;
};
