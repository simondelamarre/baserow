import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_NUMBER } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class numberConstructor extends fieldConstructor {
    override field: FIELD_NUMBER;
    get _fields() {
        return {
            number_decimal_places: {
                type: 'select',
                required: true,
                options: [ ...Array(10) ].map((i, id)=> {
                    return {key:id.toFixed(id), value:id}
                })
            },
            number_negative: {
                type:  'boolean',
                required: false
            }
        }
    }
    constructor(field: FIELD_NUMBER, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    }
    public number_decimal_places(n: number): this {
        this.field.number_decimal_places = n;
        return this;
    }
    public number_negative(n: boolean): this {
        this.field.number_negative = n;
        return this;
    }
    override build(): FIELD_NUMBER {
        return this.field;
    }
}