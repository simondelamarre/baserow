import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_CREATED_ON } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { dateConstructor } from "./date.constructor";

export class created_onConstructor extends dateConstructor {
    override field: FIELD_CREATED_ON;
    constructor(field: FIELD_CREATED_ON, table:tableBuilder, tables:tablesFactory) {
        super(field, table, tables);
        this.field = field;
    }
    override build(): FIELD_CREATED_ON {
        return this.field;
    }
}