import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_PHONE_NUMBER } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class phone_numberConstructor extends fieldConstructor {
    override field: FIELD_PHONE_NUMBER;
    get _fields() {
        return {}
    }
    constructor(field: FIELD_PHONE_NUMBER, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    }
    override build(): FIELD_PHONE_NUMBER {
        return this.field;
    }
}