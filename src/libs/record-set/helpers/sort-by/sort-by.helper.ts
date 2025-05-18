type SortByOptions<TRecord> = {
  iteratees: Array<keyof TRecord> | keyof TRecord;
  orders?: Array<'asc' | 'desc'> | 'asc' | 'desc';
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to sort the records by key(s) in ascending or descending order.
 */
export const sortBy = <TRecord>(
  options: SortByOptions<TRecord>
): Array<TRecord> => {
  const { iteratees, orders, records } = options;

  const keys = Array.isArray(iteratees) ? iteratees : [iteratees];

  const ords =
    orders === undefined
      ? keys.map(() => 'asc')
      : Array.isArray(orders)
      ? orders
      : [orders];

  return [...records].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = ords[i] ?? 'asc';

      const valA = a[key];
      const valB = b[key];

      if (valA === valB) continue;

      const dir = order === 'asc' ? 1 : -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB) * dir;
      }

      return (valA < valB ? -1 : 1) * dir;
    }

    return 0;
  });
};
