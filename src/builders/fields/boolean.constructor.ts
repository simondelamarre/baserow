import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_BOOLEAN } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class booleanConstructor extends fieldConstructor {
    override field: FIELD_BOOLEAN;
    get _fields() {
        return {}
    }
    constructor(field: FIELD_BOOLEAN, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    }
    override build(): FIELD_BOOLEAN {
        return this.field;
    }
}