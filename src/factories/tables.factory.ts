import { brconnector } from "../connector/api.connector";
import type { BASEROW_SETUPS } from "../types/setups";
import { tableBuilder } from "../builders/table.builder";
import type { FIELD_TYPE,  ANY_FIELD } from "../types/fields";
import { fieldBuilder } from "../builders/field.builder";
import type { appBuilder } from "../builders/app.builder";
import type { connectionBuilder } from "../builders/connection.builder";
export declare type TABLE = any;
export class tablesFactory extends brconnector {
    public tables: tableBuilder[] = [];
    public app: appBuilder;
    constructor(
        app: appBuilder, 
        setups: BASEROW_SETUPS,
        connector: connectionBuilder
    ) {
        super(setups, connector);
        this.app = app;
    }

    async sort(table: tableBuilder, index:number) {
        // https://api.baserow.io/api/database/tables/database/{database_id}/order/
        const id = this.tables.findIndex(a => a === table);
        this.tables.splice(index, 0, this.tables.splice(id, 1)[0]);

        await this.post(
            `api/database/tables/database/${this.app.app.id}/order/`, 
            {}, 
            {
                table_ids: this.tables.map(t => t._DATA!.id)
            }, 
            {}
        );
    }
    async list(table_ids: number[]): Promise<TABLE[]> {
        this.tables = [];
        for (const id of table_ids) {
            const table = new tableBuilder(id, this.setups, this.connector, this);
            await table.fetch();
            await table.getFields();
            this.tables.push(table);
        }
        return this.tables;
    }
    async reset(s: BASEROW_SETUPS) {
        this.tables = [];
        this.setups = s;
    }
    addField(table: tableBuilder, type: FIELD_TYPE): fieldBuilder {
        return new fieldBuilder({name:''}, table, this.setups, this.connector, this, type);
    }
    async create(
        name: string, 
        data?: ANY_FIELD[], 
        first_row_header?: boolean, 
        database?: {id:number}
    ): Promise<tableBuilder> {
        const new_table = await this.post(`/api/database/tables/database/${database?.id ? database.id : this.app.app.id}/async/`, {}, {
            name: name,
            //data: ["uuid"],
            first_row_header: first_row_header
        }, {});
        const table = new tableBuilder(new_table.id, this.setups, this.connector, this);
        return table;
    }
    async delete(table: tableBuilder): Promise<this> {
        try {
            await this.del(
                `/api/database/tables/${table._DATA!.id}/`,
                {},
                {},
                {}
            )
            this.tables = this.tables.filter(t => t !== table);
        } catch(err) {
            throw err;
        }
        return  this;
    }
    public build() {
        return this.tables.map(t => t.build())
    }
}