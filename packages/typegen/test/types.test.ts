import * as fs from 'fs'
import * as path from 'path'
import * as typegen from '../src'
import {getHelper} from './helper'
import {sql} from 'slonik'
import {expectTypeOf} from 'expect-type'

export const {typegenOptions, logger, poolHelper: helper} = getHelper({__filename})

beforeEach(async () => {
  await helper.pool.query(helper.sql`
    create table types_test_table(foo int not null, bar text);

    insert into types_test_table(foo, bar) values (1, 'a')
  `)
})

test('types are correct', async () => {
  // This test is terrifyingly meta. It modifies its own source code, then verifies the modified code is correct.
  // To be sure it's verifying the right thing, it ensures that the modification has already been done. - i.e. running
  // codegen has no effect. This means it necesssarily has to fail the very first time it's run.
  const thisTestFileBeforeRunning = fs.readFileSync(__filename).toString()

  await typegen.generate({
    ...typegenOptions(__dirname),
    glob: path.basename(__filename), // match only this file
  })

  const thisTestFileAfterRunning = fs.readFileSync(__filename).toString()

  expect(thisTestFileAfterRunning).toEqual(thisTestFileBeforeRunning)

  const results = await helper.pool.query(sql<queries.TypesTestTable>`select * from types_test_table`)

  expect(results.rows).toHaveLength(1)
  expect(results.rows).toEqual([{foo: 1, bar: 'a'}])

  expectTypeOf(results.rows).items.toEqualTypeOf<{foo: number; bar: string | null}>()
})

export module queries {
  /** - query: `select * from types_test_table` */
  export interface TypesTestTable {
    /** column: `types_test.types_test_table.foo`, not null: `true`, regtype: `integer` */
    foo: number

    /** column: `types_test.types_test_table.bar`, regtype: `text` */
    bar: string | null
  }
}
