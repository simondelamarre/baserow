import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_RATING } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { BASEROW_COLORS } from "./color.constructor";
import { fieldConstructor } from "./field.constructor";

export class ratingConstructor extends fieldConstructor {
    override field: FIELD_RATING;
    get _fields() {
        return {
            max_value: {
                type: 'number',
                min:1,
                max:10,
            },
            color: {
                type: 'color',
                options: Object.keys(BASEROW_COLORS).map(k => {
                    return {
                        key: k,
                        value: k
                    }
                })
            },
            style: {
                type: 'select',
                options: ['star', 'heart', 'thumbs-up', 'flag', 'smile'].map(k => {
                    return {
                        key: k,
                        value: k
                    }
                })
            }
        }
    }
    constructor(field: FIELD_RATING, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    }
    public max_value(n: number): this {
        this.field.max_value = n;
        return this;
    }
    public color(n: string): this {
        this.field.color = n;
        return this;
    }
    public style(n: string): this {
        this.field.style = n;
        return this;
    }
    override build(): FIELD_RATING {
        return this.field;
    }
}