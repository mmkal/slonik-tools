import * as lodash from 'lodash'
import {DatabasePoolType, sql} from 'slonik'

export function enumTypesGetter(pool: DatabasePoolType) {
  return lodash.once(async () => {
    const types = await pool.any(sql<queries.PgEnum_PgType>`
      select distinct
        e.enumtypid,
        t.typname,
        e.enumlabel,
        t.typnamespace::regnamespace::text as schema_name,
        e.enumsortorder,
        t.typnamespace::regnamespace::text = any(current_schemas(true)) as in_search_path,
        case
          when t.typnamespace::regnamespace::text = any(current_schemas(false))
            then quote_ident(t.typname)
          else
            quote_ident(t.typnamespace::regnamespace::text) || '.' || quote_ident(t.typname)
        end as searchable_type_name
      from
        pg_enum as e
      join
        pg_type as t
      on
        t.oid = e.enumtypid
      order by
        t.typnamespace::regnamespace::text,
        t.typname,
        e.enumsortorder
    `)
    return lodash.groupBy(types, t => t.searchable_type_name)
  })
}

export function regTypeToPGTypeGetter(pool: DatabasePoolType) {
  return lodash.once(async () => {
    const types = await pool.any(sql<queries.PgType>`
      select oid, typname, oid::regtype as regtype
      from pg_type
    `)

    return lodash.keyBy(types, t => t.regtype as string)
  })
}

/**
 * Global mappings from postgres type => typescript, in the absence of any field transformers.
 */
export const defaultPGDataTypeToTypeScriptMappings: Record<string, string> = {
  text: 'string',
  integer: 'number',
  real: 'number',
  oid: 'number',
  boolean: 'boolean',
  name: 'string',
  regtype: 'string',
  'double precision': 'number',
  'character varying': 'string',
  'timestamp with time zone': 'string',
  'timestamp without time zone': 'string',
  uuid: 'string',
}

// todo: map from alias and/or oid to "regtype" which is what the above are
// https://www.postgresql-archive.org/OID-of-type-by-name-td3297240.html

export declare namespace queries {
  /** - query: `select distinct e.enumtypid, t.typname, ... [truncated] ...espace::text, t.typname, e.enumsortorder` */
  export interface PgEnum_PgType {
    /** regtype: `oid` */
    enumtypid: number | null

    /** regtype: `name` */
    typname: string | null

    /** regtype: `name` */
    enumlabel: string | null

    /** regtype: `text` */
    schema_name: string | null

    /** regtype: `real` */
    enumsortorder: number | null

    /** regtype: `boolean` */
    in_search_path: boolean | null

    /** regtype: `text` */
    searchable_type_name: string | null
  }

  /** - query: `select oid, typname, oid::regtype as regtype from pg_type` */
  export interface PgType {
    /** regtype: `oid` */
    oid: number | null

    /** regtype: `name` */
    typname: string | null

    /** regtype: `regtype` */
    regtype: string | null
  }
}