import * as fsSyncer from 'fs-syncer'
import * as typegen from '../src'
import {getHelper} from './helper'

export const {typegenOptions, logger, poolHelper: helper} = getHelper({__filename})

beforeEach(async () => {
  await helper.pool.query(helper.sql`
    create table test_table(
      id int primary key,
      n int
    );
  `)
})

test('branded types', async () => {
  const syncer = fsSyncer.jestFixture({
    targetState: {
      'index.ts': `
        import {sql} from 'slonik'

        export default sql\`select id, n from test_table\`
      `,
    },
  })

  syncer.sync()

  await typegen.generate({
    ...typegenOptions(syncer.baseDir),
    writeTypes: queries => {
      queries.forEach(query => {
        query.fields.forEach(field => {
          if (field.column?.name === 'id') {
            const brand = Object.values(field.column).join('.')
            field.typescript = `(${field.typescript} & { _brand: ${JSON.stringify(brand)} })`
          }
        })
      })
      return typegen.defaults.defaultWriteTypes()(queries)
    },
  })

  expect(syncer.yaml()).toMatchInlineSnapshot(`
    "---
    index.ts: |-
      import {sql} from 'slonik'
      
      export default sql<queries.TestTable>\`select id, n from test_table\`
      
      export declare namespace queries {
        /** - query: \`select id, n from test_table\` */
        export interface TestTable {
          /** column: \`branding_test.test_table.id\`, not null: \`true\`, regtype: \`integer\` */
          id: number & {
            _brand: 'branding_test.test_table.id'
          }
      
          /** column: \`branding_test.test_table.n\`, regtype: \`integer\` */
          n: number | null
        }
      }
      "
  `)
})
