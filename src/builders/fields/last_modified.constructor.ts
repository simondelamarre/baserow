import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_LAST_MOODIFIED } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { dateConstructor } from "./date.constructor";

export class last_modifiedConstructor extends dateConstructor {
    override field: FIELD_LAST_MOODIFIED;
    
    constructor(field: FIELD_LAST_MOODIFIED, table:tableBuilder, tables:tablesFactory) {
        super(field, table, tables);
        this.field = field;
    }
    override build(): FIELD_LAST_MOODIFIED {
        return this.field;
    }
}