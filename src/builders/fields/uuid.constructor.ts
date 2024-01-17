import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_UUID } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class uuidConstructor extends fieldConstructor {
    override field: FIELD_UUID;
    constructor(field: FIELD_UUID, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    }
    override build(): FIELD_UUID {
        return this.field;
    }
}