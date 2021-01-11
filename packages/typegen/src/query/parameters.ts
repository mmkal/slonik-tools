import {randomBytes} from 'crypto'
import {DatabasePoolType, sql} from 'slonik'
import * as assert from 'assert'
import {truncateQuery} from '../util'

// todo[pgsql-ast-parser>=3.2.0] blacklist deallocate, drop, etc. rather than rely on this.
const _sql = sql

export const parameterTypesGetter = (pool: DatabasePoolType) => async (query: string): Promise<string[]> => {
  const statementName = `temp_statement_${randomBytes(16).join('')}`

  const prepareSql = `prepare ${statementName} as ${query}`

  await pool.query({
    type: 'SLONIK_TOKEN_SQL',
    sql: prepareSql,
    values: [],
  })

  try {
    const regtypes = await pool.oneFirst(
      sql<queries.PgPreparedStatements>`
        select parameter_types::text
        from pg_prepared_statements
        where name = ${statementName}
      `,
    )

    assert.ok(regtypes, `No parameters received from: prepare ${statementName} as ${truncateQuery(query)}`)
    // parameter_types is an array, but to make sure we aren't tripped over by any custom type parsers, it was cast to text.
    // so it should look like `{int,boolean,text}`
    assert.ok(regtypes.startsWith('{') && regtypes.endsWith('}'), `Unexpected parameter types format: ${regtypes}`)

    if (regtypes === '{}') return []

    return regtypes.slice(1, -1).split(',')
  } finally {
    await pool.query(_sql`deallocate ${sql.identifier([statementName])}`)
  }
}

/* istanbul ignore if */
if (require.main === module) {
  console.log = (...args: any[]) => console.dir(args.length === 1 ? args[0] : args, {depth: null})
  parameterTypesGetter(require('slonik').createPool('postgresql://postgres:postgres@localhost:5433/postgres'))(
    `select * from gdesc_test.test_table`,
  ).then(console.log, console.error)
}

export module queries {
  /** - query: `select parameter_types::text from pg_prepared_statements where name = $1` */
  export interface PgPreparedStatements {
    /** regtype: `text` */
    parameter_types: string | null
  }
}
