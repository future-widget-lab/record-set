import { omit } from '../omit/omit.helper';
import { pick } from '../pick/pick.helper';

type SelectOptions<TRecord> = {
  spec: string | string[] | Record<string, 0 | 1>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to project each record to include or exclude fields, returning a new record set of records with only those keys:
 * - String: `'a b -c +d'`.
 * - Array of strings: `['a', '-b']`.
 * - Object notation: `{ a: 1, b: 1 }` or `{ c: 0 }`.
 *
 * Inclusive if any field is positively specified (no `-` or `0`).
 *
 * Exclusive if only negatives (`-`) or zeros (`0`).
 */
export const select = <TRecord>(
  options: SelectOptions<TRecord>
): Array<Partial<TRecord>> => {
  const { spec, records } = options;

  let includes: Array<string> = [];
  let excludes: Array<string> = [];

  if (typeof spec === 'object' && !Array.isArray(spec)) {
    const keys = Object.keys(spec);

    const isInclusive = keys.some((k) => {
      return spec[k] === 1;
    });

    if (isInclusive) {
      includes = keys.filter((k) => {
        return spec[k] === 1;
      });
    } else {
      excludes = keys.filter((k) => {
        return spec[k] === 0;
      });
    }
  } else {
    /**
     * Spec is String or Array
     */
    const tokens =
      typeof spec === 'string' ? spec.split(/\s+/).filter(Boolean) : spec;

    for (const t of tokens) {
      if (t.startsWith('-')) {
        excludes.push(t.slice(1));
      } else if (t.startsWith('+')) {
        includes.push(t.slice(1));
      } else {
        includes.push(t);
      }
    }
  }

  if (includes.length > 0) {
    return pick({ fields: includes as Array<keyof TRecord>, records }) as Array<
      Partial<TRecord>
    >;
  }

  return omit({ fields: excludes as Array<keyof TRecord>, records }) as Array<
    Partial<TRecord>
  >;
};
