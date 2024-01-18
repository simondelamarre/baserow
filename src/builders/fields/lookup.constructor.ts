import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_LOOKUP } from "../../types/fields"
import type { tableBuilder } from "../table.builder";
import { fieldConstructor } from "./field.constructor";

export class lookupConstructor extends fieldConstructor {
    override field: FIELD_LOOKUP;
    get _fields() {
        let table = (this.tables.tables ?? [])
            .find(t => { 
                return t._DATA?.id == this.field.table
            });
        
        if (!this.field.table){
            table = (this.tables.tables ?? []).find(t => {
                return (t.fields ?? []).find(f => {
                    return f.field?.id === this.field.target_field_id 
                })
            });
            if (table) this.field.table = table._DATA?.id;
        }
        return { // todo:  thats not clear the baserow form wont run as well
            table: {
                type: 'select',
                required: true,
                options: this.tables.tables.map(t => {
                    return {
                        key:  t._DATA?.name,
                        value: t._DATA?.id
                    }
                })
            },
            target_field_id: {
                type: 'select',
                required: true,
                options: table?.fields.map(f => {
                    return {
                        key:  f.field.name,
                        value: f.field.id
                    }
                })
            }
        }
    }
    constructor(field: FIELD_LOOKUP, table:tableBuilder, tables:tablesFactory) {
        super(table, tables, field);
        this.field = field;
    };
    public through_field_id(id?: number): this {
        this.field.through_field_id = id;
        return this;
    };
    public through_field_name(name?: string): this {
        this.field.through_field_name = name;
        return this;
    };
    public target_field_id(id?:number): this {
        this.field.target_field_id = id;
        const table = (this.tables.tables ?? []).find(t => {
            return (t.fields ?? []).find(f => {
                return f.field?.id === this.field.target_field_id 
            })
        });
        this.field.target_field_name = table?.fields.find(f => {
            return f.field.id === id
        })?.field.name
        return this;
    };
    public target_field_name(name?:string): this {
        this.field.target_field_name = name;
        return this;
    };
    override build(): FIELD_LOOKUP {
        return this.field;
    }
}