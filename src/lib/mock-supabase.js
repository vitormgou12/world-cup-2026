import { MOCK } from "./mock-data.js";

// Cópia mutável — inserts persistem durante a sessão
const store = JSON.parse(JSON.stringify(MOCK));

class QueryBuilder {
  constructor(table) {
    this._rows = [...(store[table] || [])];
  }

  select() { return this; }

  gte(col, val) {
    this._rows = this._rows.filter(r => r[col] >= val);
    return this;
  }

  lte(col, val) {
    this._rows = this._rows.filter(r => r[col] <= val);
    return this;
  }

  in(col, vals) {
    this._rows = this._rows.filter(r => vals.includes(r[col]));
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve({ data: this._rows, error: null }).then(resolve, reject);
  }
}

export function createMockClient() {
  return {
    from(table) {
      const qb = new QueryBuilder(table);
      return {
        select: (...args) => { qb.select(...args); return qb; },
        insert: (record) => {
          store[table] = [...(store[table] || []), record];
          return Promise.resolve({ error: null });
        },
      };
    },
  };
}
