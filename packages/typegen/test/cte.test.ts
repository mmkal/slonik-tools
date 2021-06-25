import * as fsSyncer from 'fs-syncer'
import * as typegen from '../src'
import {getHelper} from './helper'

export const {typegenOptions, logger, poolHelper: helper} = getHelper({__filename})

beforeEach(async () => {
  jest.resetAllMocks()

  await helper.pool.query(helper.sql`
    create table test_table1(a int not null);
    create table test_table2(b int);
  `)
})

test(`statement with CTE`, async () => {
  const syncer = fsSyncer.jestFixture({
    targetState: {
      'index.ts': `
        import {sql} from 'slonik'

        export default sql\`
          with abc as (select table_name as tname from information_schema.tables),
          def as (select table_schema as tschema from information_schema.tables)
          select tname as n, tschema as s from abc join def on abc.tname = def.tschema
        \`
      `,
    },
  })

  syncer.sync()

  await typegen.generate(typegenOptions(syncer.baseDir))

  expect(logger.warn).not.toHaveBeenCalled()
  expect(logger.error).not.toHaveBeenCalled()

  expect(syncer.yaml()).toMatchInlineSnapshot(`
    "---
    index.ts: |-
      import {sql} from 'slonik'
      
      export default sql<queries.Abc_Def>\`
        with abc as (select table_name as tname from information_schema.tables),
        def as (select table_schema as tschema from information_schema.tables)
        select tname as n, tschema as s from abc join def on abc.tname = def.tschema
      \`
      
      export declare namespace queries {
        // Generated by @slonik/typegen
      
        /** - query: \`with abc as (select table_name as tname ... [truncated] ... abc join def on abc.tname = def.tschema\` */
        export interface Abc_Def {
          /** regtype: \`name\` */
          n: string | null
      
          /** regtype: \`name\` */
          s: string | null
        }
      }
      "
  `)
})

test(`statement with complex CTE`, async () => {
  const syncer = fsSyncer.jestFixture({
    targetState: {
      'index.ts': `
        import {sql} from 'slonik'

        export default sql\`
          with abc as (select table_name from information_schema.tables),
          def as (select table_schema from information_schema.tables, abc)
          select * from def
        \`
      `,
    },
  })

  syncer.sync()

  await typegen.generate(typegenOptions(syncer.baseDir))

  expect(logger.warn).not.toHaveBeenCalled()
  expect(logger.error).not.toHaveBeenCalled()

  expect(syncer.yaml()).toMatchInlineSnapshot(`
    "---
    index.ts: |-
      import {sql} from 'slonik'
      
      export default sql<queries.Def>\`
        with abc as (select table_name from information_schema.tables),
        def as (select table_schema from information_schema.tables, abc)
        select * from def
      \`
      
      export declare namespace queries {
        // Generated by @slonik/typegen
      
        /** - query: \`with abc as (select table_name from info... [truncated] ...on_schema.tables, abc) select * from def\` */
        export interface Def {
          /** regtype: \`name\` */
          table_schema: string | null
        }
      }
      "
  `)
})

test(`statement with confusingly-named CTE`, async () => {
  const syncer = fsSyncer.jestFixture({
    targetState: {
      'index.ts': `
        import {sql} from 'slonik'

        export default sql\`
          with test_table1 as (select b as a from test_table2)
          select a from test_table1
        \`
      `,
    },
  })

  syncer.sync()

  await typegen.generate(typegenOptions(syncer.baseDir))

  expect(logger.warn).not.toHaveBeenCalled()
  expect(logger.error).not.toHaveBeenCalled()

  expect(syncer.yaml()).toMatchInlineSnapshot(`
    "---
    index.ts: |-
      import {sql} from 'slonik'
      
      export default sql<queries.TestTable1>\`
        with test_table1 as (select b as a from test_table2)
        select a from test_table1
      \`
      
      export declare namespace queries {
        // Generated by @slonik/typegen
      
        /** - query: \`with test_table1 as (select b as a from test_table2) select a from test_table1\` */
        export interface TestTable1 {
          /** regtype: \`integer\` */
          a: number | null
        }
      }
      "
  `)
})
