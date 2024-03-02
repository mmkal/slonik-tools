/* eslint-disable */
// generated by ../scripts/generate-types.ts - do not edit manually

export interface Queries {
    SCHEMAS_QUERY:       SchemasQuery[];
    ENUMS_QUERY:         EnumsQuery[];
    ALL_RELATIONS_QUERY: AllRelationsQuery[];
    INDEXES_QUERY:       IndexesQuery[];
    SEQUENCES_QUERY:     SequencesQuery[];
    CONSTRAINTS_QUERY:   ConstraintsQuery[];
    EXTENSIONS_QUERY:    ExtensionsQuery[];
    FUNCTIONS_QUERY:     FunctionsQuery[];
    PRIVILEGES_QUERY:    any[];
    TRIGGERS_QUERY:      TriggersQuery[];
    COLLATIONS_QUERY:    CollationsQuery[];
    RLSPOLICIES_QUERY:   RlspoliciesQuery[];
    TYPES_QUERY:         any[];
    DOMAINS_QUERY:       any[];
    DEPS_QUERY:          DepsQuery[];
}

export interface AllRelationsQuery {
    relationtype:       Relationtype;
    schema:             SchemaDependentOnEnum;
    name:               string;
    definition:         null | string;
    position_number:    number | null;
    attname:            null | string;
    not_null:           boolean | null;
    datatype:           Datatype | null;
    is_identity:        boolean | null;
    is_identity_always: boolean | null;
    is_generated:       boolean | null;
    collation:          null | string;
    defaultdef:         null | string;
    oid:                number;
    datatypestring:     Datatype | null;
    is_enum:            boolean;
    enum_name:          null | string;
    enum_schema:        ProcSchemaEnum | null;
    comment:            null;
    parent_table:       ParentTable | null;
    partition_def:      PartitionDef | null;
    rowsecurity:        boolean;
    forcerowsecurity:   boolean;
    persistence:        Persistence;
    page_size_estimate: number;
    row_count_estimate: number;
}

export type Datatype = "text" | "integer" | "circle" | "numeric" | "uuid" | "order_status" | "other.otherenum1" | "other.otherenum2" | "e" | "character varying" | "shipping_status" | "usage_dropped_enum" | "hstore" | "interval" | "bigint" | "timestamp without time zone" | "date" | "character varying(10)";

export type ProcSchemaEnum = "other" | "public" | "goodschema";

export type ParentTable = "\"public\".\"entity_bindings\"" | "\"public\".\"timestamp_base\"" | "\"public\".\"measurement\"";

export type PartitionDef = "RANGE (logdate)" | "FOR VALUES FROM ('2006-02-01') TO ('2006-03-01')" | "FOR VALUES FROM ('2006-03-01') TO ('2006-04-01')" | "FOR VALUES FROM ('2005-02-01') TO ('2005-03-01')";

export type Persistence = "p" | "u";

export type Relationtype = "r" | "v" | "m" | "p";

export type SchemaDependentOnEnum = "public" | "x" | "excludedschema" | "schema1" | "schema2" | "goodschema";

export interface CollationsQuery {
    name:       string;
    schema:     ProcSchemaEnum;
    provider:   string;
    encoding:   number;
    lc_collate: string;
    lc_ctype:   string;
    version:    null | string;
}

export interface ConstraintsQuery {
    schema:               ProcSchemaEnum;
    name:                 string;
    table_name:           string;
    definition:           string;
    constraint_type:      ConstraintType;
    index:                null | string;
    extension_oid:        null;
    foreign_table_schema: ProcSchemaEnum | null;
    foreign_table_name:   null | string;
    fk_columns_local:     null | string;
    fk_columns_foreign:   null | string;
    is_fk:                boolean;
    is_deferrable:        boolean;
    initially_deferred:   boolean;
}

export type ConstraintType = "PRIMARY KEY" | "UNIQUE" | "EXCLUDE" | "FOREIGN KEY" | "CHECK";

export interface DepsQuery {
    objid:                           number;
    schema:                          SchemaDependentOnEnum;
    name:                            string;
    identity_arguments:              null;
    kind:                            Relationtype;
    objid_dependent_on:              number;
    schema_dependent_on:             SchemaDependentOnEnum;
    name_dependent_on:               string;
    identity_arguments_dependent_on: null;
    kind_dependent_on:               Relationtype;
}

export interface EnumsQuery {
    schema:   ProcSchemaEnum;
    name:     string;
    elements: string[];
}

export interface ExtensionsQuery {
    schema:  EXTENSIONSQUERYSchema;
    name:    Name;
    version: string;
    oid:     number;
}

export type Name = "plpgsql" | "pg_trgm" | "citext" | "hstore";

export type EXTENSIONSQUERYSchema = "pg_catalog" | "public";

export interface FunctionsQuery {
    schema:                      ProcSchemaEnum;
    name:                        string;
    returntype:                  Type | null;
    has_user_defined_returntype: boolean | null;
    parameter_name:              null | string;
    data_type:                   Type | null;
    parameter_mode:              ParameterMode | null;
    parameter_default:           null;
    position_number:             number | null;
    definition:                  string;
    full_definition:             string;
    language:                    Language;
    strictness:                  Strictness;
    security_type:               SecurityType;
    volatility:                  Volatility;
    kind:                        Kind;
    oid:                         number;
    extension_oid:               null;
    result_string:               ResultString;
    identity_arguments:          IdentityArguments;
    comment:                     null;
}

export type Type = "text" | "integer" | "ARRAY";

export type IdentityArguments = "t text" | "i integer, t text[]" | "";

export type Kind = "f";

export type Language = "SQL" | "PLPGSQL";

export type ParameterMode = "IN" | "OUT";

export type ResultString = "TABLE(x text)" | "TABLE(a text, c integer)" | "trigger";

export type SecurityType = "SECURITY INVOKER" | "SECURITY DEFINER";

export type Strictness = "CALLED ON NULL INPUT" | "RETURNS NULL ON NULL INPUT";

export type Volatility = "VOLATILE" | "STABLE";

export interface IndexesQuery {
    schema:                ProcSchemaEnum;
    table_name:            string;
    name:                  string;
    oid:                   number;
    extension_oid:         null;
    definition:            string;
    index_columns:         string;
    key_options:           string;
    total_column_count:    number;
    key_column_count:      number;
    num_att:               number;
    included_column_count: number;
    is_unique:             boolean;
    is_pk:                 boolean;
    is_exclusion:          boolean;
    is_immediate:          boolean;
    is_clustered:          boolean;
    key_collations:        string;
    key_expressions:       null;
    partial_predicate:     null;
    algorithm:             Algorithm;
    key_columns:           string;
    included_columns:      IncludedColumns;
}

export type Algorithm = "btree" | "gist";

export type IncludedColumns = "{}";

export interface RlspoliciesQuery {
    name:        string;
    schema:      ProcSchemaEnum;
    table_name:  string;
    commandtype: string;
    permissive:  boolean;
    roles:       string[];
    qualtree:    string;
    qual:        string;
    withcheck:   null;
}

export interface SchemasQuery {
    schema: string;
}

export interface SequencesQuery {
    schema:      ProcSchemaEnum;
    name:        string;
    table_name:  null | string;
    column_name: ColumnName | null;
    is_identity: boolean;
}

export type ColumnName = "id" | "order_id" | "product_no";

export interface TriggersQuery {
    name:            string;
    schema:          ProcSchemaEnum;
    table_name:      string;
    full_definition: string;
    proc_name:       ProcName;
    proc_schema:     ProcSchemaEnum;
    enabled:         Enabled;
    extension_owned: boolean;
}

export type Enabled = "O";

export type ProcName = "emp_stamp" | "trigger_func" | "my_function";