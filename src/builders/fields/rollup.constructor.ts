import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_ROLLUP } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class rollupConstructor extends fieldConstructor {
    override field: FIELD_ROLLUP;

    get _fields() {
        return {
            through_field_id: {
                type: 'select',
                required: true,
                options: []
            },
            rollup_function: {
                type: 'string',
                required: true
            }
        }
    }
    constructor(field: FIELD_ROLLUP, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    }
    public through_field_id(n?: number): this {
        this.field.through_field_id = n;
        return this;
    }
    public target_field_id(n?: number): this {
        this.field.target_field_id = n;
        return this;
    }
    public rollup_function(n?: string): this {
        this.field.rollup_function = n;
        return this;
    }
    override build(): FIELD_ROLLUP {
        return this.field;
    }
}