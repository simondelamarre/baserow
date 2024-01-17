import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_DATE } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class dateConstructor  extends fieldConstructor {
    override field: FIELD_DATE;
    get _fields() {
        return {
            date_format: {
                type: 'select',
                required: true,
                options: [
                    {
                        key: 'europe dd/mm/YYYY',
                        value: 'EU'
                    },
                    {
                        key: 'american mm/dd/YYYY',
                        value: 'US'
                    },
                    {
                        key: 'ISO YYYY/MM/DD',
                        value: 'ISO'
                    }
                ]
            },
            date_include_time: {
                type: 'boolean',
                required: true,
                childrens: {
                    date_time_format: {
                        value: true,
                        type: 'select',
                        required: true,
                        options: [
                            {
                                key: 'europe dd/mm/YYYY',
                                value: 'dd/mm/YYYY'
                            },
                            {
                                key: 'american mm/dd/YYYY',
                                value: 'dd/mm/YYYY'
                            },
                            {
                                key: 'ISO YYYY/MM/DD',
                                value: 'YYYY/MM/DD'
                            }
                        ]
                    },
                }
            },
            date_show_tzinfo: {
                type: 'boolean',
                required: true,
            },
            /* todo: liser  les  fuseaux horaires as a select
            date_force_timezone: {
                type: 'boolean',
                required: true,
            } */
        }
    }
    constructor(field: FIELD_DATE, table:tableBuilder, tables:tablesFactory) {
        super(table,  tables,  field);
        this.field = field;
    }
    public date_format(str: string):this {
        this.field.date_format = str;
        return this;
    }
    public date_include_time(b: boolean):this  {
        this.field.date_include_time = b;
        return this;
    }
    public date_time_format(str: string):this  {
        this.field.date_time_format = str;
        return this;
    }
    public date_show_tzinfo(b: boolean):this  {
        this.field.date_show_tzinfo = b;
        return this;
    }
    public date_force_timezone(b: boolean):this  {
        this.field.date_force_timezone = b;
        return this;
    }
    override build(): FIELD_DATE {
        return this.field;
    }
}