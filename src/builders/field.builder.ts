import { textConstructor } from "./fields/text.constructor";
import { numberConstructor } from "./fields/number.constructor";
import { long_textConstructor } from "./fields/long_text.constructor";
import { ratingConstructor } from "./fields/rating.constructor";
import { booleanConstructor } from "./fields/boolean.constructor";
import { dateConstructor } from "./fields/date.constructor";
import { last_modifiedConstructor } from "./fields/last_modified.constructor";
import { created_onConstructor } from "./fields/created_on.constructor";
import { link_rowConstructor } from "./fields/link_row.constructor";
import { option_selectConstructor } from "./fields/option_select.constructor";
import { single_selectConstructor } from "./fields/single_select.constructor";
import { multiple_selectConstructor } from "./fields/multiple_select.constructor";
import { phone_numberConstructor } from "./fields/phone_number.constructor";
import { formulaConstructor } from "./fields/formula.constructor";
import { countConstructor } from "./fields/count.constructor";
import { rollupConstructor } from "./fields/rollup.constructor";
import { lookupConstructor } from "./fields/lookup.constructor";
import { uuidConstructor } from "./fields/uuid.constructor";
import { brconnector } from "../connector/api.connector";
import type { BASEROW_SETUPS } from "../types/setups";
import { FIELD_TYPE, type ANY_FIELD } from "../types/fields";
import type { tableBuilder } from "./table.builder";
import type { tablesFactory } from "../factories/tables.factory";
import type { rowBuilder } from "./row.builder";
import type { connectionBuilder } from "./connection.builder";
import type { optionsBuilder } from "./fields/options.builder";
import type { fieldConstructor } from "./fields/field.constructor";
export class fieldBuilder extends brconnector {
    public constructors:{[key:string]:any} = {
        text: textConstructor,
        long_text: long_textConstructor,
        number: numberConstructor,
        rating: ratingConstructor,
        boolean: booleanConstructor,
        date: dateConstructor,
        last_modified: last_modifiedConstructor,
        created_on: created_onConstructor,
        link_row: link_rowConstructor,
        option_select: option_selectConstructor,
        single_select: single_selectConstructor,
        multiple_select: multiple_selectConstructor,
        phone_number: phone_numberConstructor,
        formula: formulaConstructor,
        count: countConstructor,
        rollup: rollupConstructor,
        lookup: lookupConstructor,
        uuid: uuidConstructor
    }
    public options ?: optionsBuilder;
    public _form: {[key:string]:any} = {
        name: {
            type: 'string',
            required: true,
            value: undefined
        },
        type: {
            type: 'select',
            required: true,
            value: undefined,
            options: Object.keys(FIELD_TYPE).map(f => {
                return  {
                    key: FIELD_TYPE[f as keyof typeof FIELD_TYPE],
                    value: FIELD_TYPE[f as keyof typeof FIELD_TYPE]
                }
            })
        }
    };
    public _fields: {[key:string]:any} = {};
    public ctor?: fieldConstructor = undefined;
    public field: ANY_FIELD;
    public table: Partial<tableBuilder>;
    public tables?: tablesFactory;
    public value?: any;
    public row?: rowBuilder;
    constructor(
        field:ANY_FIELD, 
        table: Partial<tableBuilder>, 
        setups: BASEROW_SETUPS, 
        connector:  connectionBuilder,
        tables?:tablesFactory, 
        type?: string, 
        row?: rowBuilder, 
        value?: any
    ) {
        super(setups, connector);
        this.table = table;
        this.tables = tables;
        this.field = field;
        if (type && this.constructors[type]) {
            this.ctor = new this.constructors[type](field, this.table, this.tables);
        }
        this.value = value;
        this.row = row;
    }
    get form() {
        //@ts-ignore
        return {...this._form, ...this._fields, ...this.ctor ? this.ctor._fields : this._fields};
    } 
    public table_id(): number {
        return this.field.table_id ?? 0;
    }
    public name(str:string): this {
        this.field.name = str;
        return this;
    }
    public order(n:number): this {
        this.field.order = n;
        return this;
    }
    public type(type?: FIELD_TYPE): any {
        this.field.type = type;
        if (type && this.constructors[type]) {
            this.ctor = new this.constructors[type](this.field, this.table, this.tables);
        }
        return this;
    }
    public extend(superclass:fieldBuilder, construct:any) {
        Object.setPrototypeOf(superclass, construct);
    }
    
    public primary(b?: boolean): this {
        this.field.primary = b;
        return this;
    }
    public read_only(b?: boolean): this {
        this.field.read_only = b;
        return this;
    }
    public async remove() {
        await this.del(
            `/api/database/fields/${this.field.id}/`,
            {},
            {},
            {}
        )
        await this.table.getFields?.();
    }
    public async update() {
        this.build();
        await this.patch(
            `/api/database/fields/${this.field.id}/`,
            {},
            this.field,
            {}
        )
        // await this.table.fetch();
    }
    public async updateValue(value:any) {
        if (!this.row || !this.row._DATA.id || !this.table || !this.table.id) return;
        
        const news = await this.patch(`/api/database/rows/table/${this.table.id}/${this.row._DATA.id}/?user_field_names=true`, 
            {}, 
            {[this.field.name]:value}, 
            {}, 
            'Token');
        this.value = value;
        this.row.update(news);
    }
    public async create() {
        this.table.addField?.(this);
    }
    public build(): ANY_FIELD {
        if (this.ctor) {
            this.field = this.ctor.build();
        }
        return this.field;
    }
}