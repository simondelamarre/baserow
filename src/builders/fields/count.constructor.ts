import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_COUNT } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { formulaConstructor } from "./formula.constructor";

export class countConstructor extends formulaConstructor {
    override field: FIELD_COUNT;
    get _fields() {
        return {}
    }
    constructor(field: FIELD_COUNT, table:tableBuilder, tables:tablesFactory) {
        super(field, table, tables);
        this.field = field;
    }
    through_field_id(field_id:number): this {
        this.field.through_field_id = field_id;
        return this;
    }
    override build(): FIELD_COUNT {
        return this.field;
    }
}