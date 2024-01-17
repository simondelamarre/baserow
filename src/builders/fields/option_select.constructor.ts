import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_OPTION_SELECT } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class option_selectConstructor  {
    public field: FIELD_OPTION_SELECT;
    get _fields() {
        return {}
    }
    constructor(field: FIELD_OPTION_SELECT, table:tableBuilder, tables:tablesFactory) {
        // super(table, tables, field);
        this.field = field;
    }
    public id(n: number) : this{
        this.field.id = n;
        return this;
    }
    public value(n: string) : this{
        this.field.value = n;
        return this;
    }
    public color(n: string) : this{
        this.field.color = n;
        return this;
    }
    public build(): FIELD_OPTION_SELECT {
        return this.field;
    }
}