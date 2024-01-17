import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_LINK_ROW } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class link_rowConstructor extends fieldConstructor {
    override field: FIELD_LINK_ROW;
    get _fields() {
        return{
            link_row_table_id: {
                type: 'select',
                required: true,
                options: (this.tables?.tables ?? []).map(t => {
                    return {
                        key: t._DATA?.name ?? "foo",
                        value: t._DATA?.id ?? 4
                    }
                })
            },
            has_related_field: {
                type: 'boolean'
            }
        }
    }
    constructor(field: FIELD_LINK_ROW, table:tableBuilder, tables:tablesFactory) {
        super(table, tables,  field);
        this.field = field;
    }
    public link_row_table_id(n?: number):this{
        this.field.link_row_table_id = n;
        return this;
    }
    public link_row_related_field_id(n: number):this{
        this.field.link_row_related_field_id = n;
        return this;
    }
    public link_row_table(n?: number):this{
        this.field.link_row_table = n;
        return this;
    }
    public link_row_related_field(n: number):this{
        this.field.link_row_related_field = n;
        return this;
    }
    override build(): FIELD_LINK_ROW {
        return this.field;
    }
}