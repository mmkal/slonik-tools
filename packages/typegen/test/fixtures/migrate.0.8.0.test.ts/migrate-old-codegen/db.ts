import {sql} from 'slonik'

import {createPool} from 'slonik'

/* setupTypeGen call removed. There may be remaining references to poolConfig which should be deleted manually */

export const slonik = createPool('...', poolConfig)

export const queryA = sql<queries.A>`
  select 1 as a
`

export const queryB = sql<queries.B>`
  select 1 as b
`

module queries {
  /** - query: `select 1 as a` */
  export interface A {
    /** postgres type: `integer` */
    a: number | null
  }

  /** - query: `select 1 as b` */
  export interface B {
    /** postgres type: `integer` */
    b: number | null
  }
}