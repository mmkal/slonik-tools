import * as fsSyncer from 'fs-syncer'
import * as typegen from '../src'
import {getHelper} from './helper'

export const {typegenOptions, logger, poolHelper: helper} = getHelper({__filename})

beforeEach(async () => {
  await helper.pool.query(helper.sql`
    create table table1(a int not null);
  `)
})

test('aliased function', async () => {
  const syncer = fsSyncer.jestFixture({
    targetState: {
      'index.ts': `
        import {sql, createPool} from 'slonik'

        export default [
          sql\`select a from json_populate_record(null::table1, '{"a": 1}')\`,
          sql\`select a from json_populate_record(null::table1, '{"a": 1}') rec\`,
        ]
      `,
    },
  })

  syncer.sync()

  await typegen.generate(typegenOptions(syncer.baseDir))

  expect(syncer.yaml()).toMatchInlineSnapshot(`
    "---
    index.ts: |-
      import {sql, createPool} from 'slonik'
      
      export default [
        sql<queries.A>\`select a from json_populate_record(null::table1, '{\\"a\\": 1}')\`,
        sql<queries.A>\`select a from json_populate_record(null::table1, '{\\"a\\": 1}') rec\`,
      ]
      
      export declare namespace queries {
        // Generated by @slonik/typegen
      
        /**
         * queries:
         * - \`select a from json_populate_record(null::table1, '{\\"a\\": 1}')\`
         * - \`select a from json_populate_record(null::table1, '{\\"a\\": 1}') rec\`
         */
        export interface A {
          /** regtype: \`integer\` */
          a: number | null
        }
      }
      "
  `)
})
