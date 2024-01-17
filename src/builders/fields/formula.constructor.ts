import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_FORMULA} from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class formulaConstructor extends  fieldConstructor {
    override field: FIELD_FORMULA;
    public _message: string = "only available on baserow interface";
    get _fields() {
        return {}
    }
    constructor(field: FIELD_FORMULA, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    }
    public date_include_time(b?: boolean):this{
        this.field.date_include_time = b
        return this;
    }
    public date_force_timezone(b?: boolean):this{
        this.field.date_force_timezone = b
        return this;
    }
    public date_format(str?: string): this {
        this.field.date_format = str
        return this;
    }
    public date_show_tzinfo(b?: boolean):this{
        this.field.date_show_tzinfo = b
        return this;
    }
    public nullable(b?: boolean):this{
        this.field.nullable = b
        return this;
    }
    public array_formula_type(str?: string): this {
        this.field.date_format = str
        return this;
    }
    public error(str?: string): this {
        this.field.date_format = str
        return this;
    }
    public formula(str?: string): this {
        this.field.date_format = str
        return this;
    }
    public formula_type(str?: string): this {
        this.field.date_format = str
        return this;
    }
    override build(): FIELD_FORMULA {
        return this.field;
    }
}