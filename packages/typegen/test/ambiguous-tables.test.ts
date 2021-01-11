import * as fsSyncer from 'fs-syncer'
import * as typegen from '../src'
import {getHelper} from './helper'

export const {gdescParams, logger, poolHelper: helper} = getHelper({__filename})

beforeEach(async () => {
  await helper.pool.query(helper.sql`
    drop schema if exists test_schema_1 cascade;
    drop schema if exists test_schema_2 cascade;

    create schema test_schema_1;
    create schema test_schema_2;

    -- default schema
    create type test_enum as enum('default_schema_A', 'default_schema_B', 'default_schema_C');
    -- specific schema
    create type test_schema_1.test_enum as enum('schema1_A', 'schema1_B', 'schema1_C');
    -- another specific schema
    create type test_schema_2.test_enum as enum('schema2_A', 'schema2_B', 'schema2_C');

    create table test_schema_1.test_table(id int not null, e test_schema_1.test_enum, eee test_enum);
    create table test_schema_2.test_table(id int, e test_schema_2.test_enum);

    comment on column test_schema_1.test_table.id is 'This is a comment for test_schema_1.test_table.id';
    comment on column test_schema_2.test_table.id is 'This is a comment for test_schema_2.test_table.id';
  `)
})

test('disambiguate between same-named tables', async () => {
  const syncer = fsSyncer.jestFixture({
    targetState: {
      'index.ts': `
        import {sql} from 'slonik'

        export default [
          sql\`select * from test_schema_1.test_table\`,
          sql\`select * from test_schema_2.test_table\`,
        ]
      `,
    },
  })

  syncer.sync()

  await typegen.generate(gdescParams(syncer.baseDir))

  const result = syncer.read()

  expect(result['index.ts']).toContain(`This is a comment for test_schema_1.test_table.id`)
  expect(result['index.ts']).toContain('column: `test_schema_1.test_table.id`, not null: `true`, regtype: `integer`')
  expect(result['index.ts']).toContain(`This is a comment for test_schema_2.test_table.id`)
  expect(result['index.ts']).toContain('column: `test_schema_2.test_table.id`, regtype: `integer`')

  expect(syncer.yaml()).toMatchInlineSnapshot(`
    "---
    index.ts: |-
      import {sql} from 'slonik'
      
      export default [
        sql<queries.TestTable>\`select * from test_schema_1.test_table\`,
        sql<queries.TestTable_0>\`select * from test_schema_2.test_table\`,
      ]
      
      export module queries {
        /** - query: \`select * from test_schema_1.test_table\` */
        export interface TestTable {
          /**
           * This is a comment for test_schema_1.test_table.id
           *
           * column: \`test_schema_1.test_table.id\`, not null: \`true\`, regtype: \`integer\`
           */
          id: number
      
          /** column: \`test_schema_1.test_table.e\`, regtype: \`test_schema_1.test_enum\` */
          e: ('schema1_A' | 'schema1_B' | 'schema1_C') | null
      
          /** column: \`test_schema_1.test_table.eee\`, regtype: \`test_enum\` */
          eee: ('default_schema_A' | 'default_schema_B' | 'default_schema_C') | null
        }
      
        /** - query: \`select * from test_schema_2.test_table\` */
        export interface TestTable_0 {
          /**
           * This is a comment for test_schema_2.test_table.id
           *
           * column: \`test_schema_2.test_table.id\`, regtype: \`integer\`
           */
          id: number | null
      
          /** column: \`test_schema_2.test_table.e\`, regtype: \`test_schema_2.test_enum\` */
          e: ('schema2_A' | 'schema2_B' | 'schema2_C') | null
        }
      }
      "
  `)
})
