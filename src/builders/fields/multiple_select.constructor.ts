import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_MULTIPLE_SELECT } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { BASEROW_COLORS } from "./color.constructor";
import { fieldConstructor } from "./field.constructor";
import { optionsBuilder } from "./options.builder";

export class multiple_selectConstructor extends fieldConstructor {
    override field: FIELD_MULTIPLE_SELECT;
    public options: optionsBuilder;
    get _fields() {
        return {
            select_options: {
                type: 'options',
                required: true,
                options: this.options.options ?? [],
                chilrens: {
                    color: {
                        type: 'color',
                        options: Object.keys(BASEROW_COLORS).map(k => {
                            return {
                                key: k,
                                value: k
                            }
                        })
                    },
                    label: {
                        type: 'text',
                        required: true,
                        options: this.options.options ?? [],
                    },
                }
            }
        }
    }
    constructor(field: FIELD_MULTIPLE_SELECT, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
        this.options = new optionsBuilder(field.select_options);
    }
    override build(): FIELD_MULTIPLE_SELECT {
        this.field.select_options = this.options.build();
        return this.field;
    }
}