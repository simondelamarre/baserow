import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_TEXT } from "../../types/fields"
import type { BASEROW_SETUPS } from "../../types/setups";
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class textConstructor extends fieldConstructor {
    public field: FIELD_TEXT;
    get _fields() {
        return {
            text_default: {
                type: 'string',
                required: false
            }
        }
    }
    constructor(field: FIELD_TEXT, table:tableBuilder, tables:tablesFactory) {
        super(table,  tables,  field);
        this.field = field;
    }
    public text_default(str:string):this {
        this.field.text_default = str;
        return this
    }
    override build(): FIELD_TEXT {
        return this.field;
    }
}