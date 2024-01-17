import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_SINGLE_SELECT } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";
import { optionsBuilder } from "./options.builder";

export class single_selectConstructor extends fieldConstructor {
    override field: FIELD_SINGLE_SELECT;
    public options: optionsBuilder;
    get _fields() {
        return {
            select_options: {
                type: 'options',
                required: true,
                options: this.options.options ?? []
            }
        }
    }
    constructor(field: FIELD_SINGLE_SELECT, table:tableBuilder, tables:tablesFactory) {
        super(table,  tables,  field);
        this.field = field;
        this.options = new optionsBuilder(field.select_options);
    }
    override build(): FIELD_SINGLE_SELECT {
        this.field.select_options = this.options.build();
        return this.field;
    }
}