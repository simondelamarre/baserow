import { brconnector } from "../connector/api.connector";
import type { tablesFactory } from "../factories/tables.factory";
import type { ANY_FIELD, FIELD, FIELD_DATE, FIELD_TYPE } from "../types/fields";
import type { BASEROW_SETUPS } from "../types/setups";
import type { TABLE } from "../factories/application.factory";
import { fieldBuilder } from "./field.builder";
import { queryBuilder, type BASEROW_RESULT } from "./query.builder";
import type { connectionBuilder } from "./connection.builder";
import type { workspaceBuilder } from "./workspace.builder";
import type { appBuilder } from "./app.builder";
import type { rowBuilder } from "./row.builder";


export class tableBuilder extends brconnector {
    public id: number;
    public _DATA?: TABLE;
    public _FIELDS?: ANY_FIELD[];
    public fields: fieldBuilder[] = [];
    public factory?: tablesFactory;
    public queries: queryBuilder[] = [];
    public gettingPos:  boolean = false;
    public pos?: rowBuilder;
    /* get position(): {
        x:number,
        y:number
    } { 
        return {
            x: this.pos?._DATA.posX ?? 0,
            y: this.pos?._DATA.posY ?? 0
        }
    } */
    /* public drow: {
        builder?:workspaceBuilder,
        app?:appBuilder,
        tables?:tableBuilder
    } = {
        builder: undefined,
        app: undefined,
        tables: undefined
    }; */
    constructor(
        table_id: number, 
        setups: BASEROW_SETUPS,
        connector: connectionBuilder, 
        factory?:tablesFactory) {
        super(setups, connector)
        this.id = table_id;
        this.factory = factory;
        if (this.connector.live) {
            this.connector.auth.listen(
                {
                    "page": "table",
                    "table_id": table_id
                },
                this.onmessage.bind(this)
            );
        }
    }
    /* async getPos(x?:number, y?:number) {
        if (this.gettingPos || this.pos) return;
        this.gettingPos = true;
        this.drow.builder = this.connector.workspaces.workspaces.find(w => w.workspace.name == 'drow');
        await this.drow.builder?.listApps();
        if (this.drow.builder) {
            this.drow.app = this.drow.builder.applications.apps.find(app => app.app.name == 'tables');
            await this.drow.app?.getTables();
        }

        const positionBuilder = this.drow.app?.tables.tables.find(t => t._DATA?.name=='tables');
        
        if (positionBuilder) {
            const query = positionBuilder.queries[0] ?? positionBuilder.query();
            if (query) {
                query.filter.clear();
                query.filter.add('table_id', 'equal', this._DATA?.id);
                const row = await query?.scroll();
                if (row.rows[0])
                    this.pos = row.rows[0];
                else {
                    await positionBuilder.addRow({
                        table_id: this._DATA?.id,
                        posX: x,
                        poxY: y
                    })
                    const row = await query?.scroll();
                    if (row.rows[0]){
                        this.pos = row.rows[0];
                        
                    }
                }

                
                ///console.log('fetched  row builder from drow tables ',  this.pos);
            }
        }
    }
    async setPos(x:number, y:number) {
        console.info('will set pos on the current row builder elected by callin getPos() first');
    } */
    onmessage(msg:any):void {
        try {
            const data = JSON.parse(msg.data);

            switch(data.type) {
                case "authentication":
                case "page_add":
                case "page_discard":
                case "before_group_deleted":
                case "user_updated":
                case "user_deleted":
                case "user_restored":
                case "user_permanently_deleted":
                case "group_created":
                case "group_updated":
                case "group_deleted":
                case "group_restored":
                case "group_user_added":
                case "group_user_updated":
                case "group_user_deleted":
                case "application_created":
                case "application_updated":
                case "application_deleted":
                case "applications_reordered":
                    break;
                case "table_created":
                case "table_updated":
                case "table_deleted":
                case "tables_re_ordered":
                    break;
                case "field_created":
                case "field_updated":
                case "field_deleted":
                case "field_restored":
                    try {
                        const field = this.fields.find(f => f.field.id === data.field.id);
                        if (field) {    
                            field.field = data.field;  
                            this._DATA = data.field;                      
                        }
                    } catch(err) {}
                    break;
                case "rows_created":
                case "rows_updated":
                case "rows_deleted":
                case "before_rows_update":
                case "before_rows_delete":
                case "row_history_updated":
                case "view_created":
                case "view_updated":
                case "view_deleted":
                case "view_filter_created":
                case "view_filter_updated":
                case "view_filter_deleted":
                case "view_filter_group_created":
                case "view_filter_group_updated":
                case "view_filter_group_deleted":
                case "view_sort_created":
                case "view_sort_updated":
                case "view_sort_deleted":
                case "view_decoration_created":
                case "view_decoration_updated":
                case "view_decoration_deleted":
                case "view_field_options_updated":
                case "views_reordered":
                    break;
                case "row_comment_created":
                case "row_comment_updated":
                case "row_comment_deleted":
                    break;

            }
        } catch(err) {}
    }

    listen() {}
    async fetch(): Promise<TABLE> {
        const res = await this.get(
            `/api/database/tables/${this.id}/`,
            {},
            {}
        );
        this._DATA = res;
        return res;
    }
    public query(): queryBuilder | undefined {
        // if(!this.factory) return;
        const builder = new queryBuilder({}, this, this.connector, this.factory);
        this.queries.push(builder);
        return builder;
    }

    async rows() {
        // https://api.baserow.io/api/database/rows/table/220342/?user_field_names=true
        const res = this.get(`/api/database/rows/table/${this._DATA?.id}/?user_field_names=true&size=2&page=1`,
            {},
            {},
            'Token',
            false)
        return res;
    }
    async getFields(): Promise<any> {
        try {
            const res = await this.get(
                `/api/database/fields/table/${this.id}/`,
                {},
                {},
                'Token'
            );
            this._FIELDS = res as ANY_FIELD[];
            this.fields = [];
            for (const field of this._FIELDS) {
                const f = new fieldBuilder(field, this, this.setups, this.connector, this.factory, field.type)
                this.fields.push(f);
            }
        } catch(err) {
            
        }
        return this._FIELDS;
    }
    async addRow(data:any): Promise<BASEROW_RESULT> {
        return await this.post(`/api/database/rows/table/${this._DATA?.id}/?user_field_names=true`, {}, data, {}, 'Token');
    }
    addingField(field: ANY_FIELD, type?: FIELD_TYPE): fieldBuilder {
        return new fieldBuilder(field, this, this.setups, this.connector, this.factory, type);
    }
    async addField(field: fieldBuilder): Promise<this> {
        // todo: find how to set field field: FIELD, on post create 
        // https://api.baserow.io/api/redoc/#tag/Database-table-fields/operation/create_database_table_field
        field.build().table_id = this._DATA!.id;
        await this.post(
            `/api/database/fields/table/${this.id}/`,
            {},
            field.build(),
            {}
        )
        await this.getFields();
        return this;
    }
    async updateField(field: ANY_FIELD | fieldBuilder): Promise<this> {
        if (field instanceof fieldBuilder) {
            field = field.build() as ANY_FIELD;
            // https://api.baserow.io/api/database/fields/{field_id}/
            if (field.id)
                await this.patch(
                    `/api/database/fields/${field.id}/`,
                    {},
                    field,
                    {}
                )
            else
                await this.post(
                    `/api/database/fields/table/${this.id}/`,
                    {},
                    field.build(),
                    {}
                )
        }
        
        return this;
    }
    async deleteField(field:fieldBuilder): Promise<{related_fields: FIELD[]}> {
        // https://api.baserow.io/api/database/fields/{field_id}/
        try {
            const res: {
                related_fields: FIELD[]
            } = await this.del(`/api/database/fields/${field.field.id!}/`, {}, {}, {});
            /* if (res && res.related_fields  && res.related_fields.length > 0) {} */
            return res;
        } catch(err) {
            throw err;
        }
    }
    async delete(): Promise<this> {
        try {
            if (this.factory)
                await this.factory.delete(this);
            return this;
        } catch(err) {  
            throw err;
        }
    }
    async name(name:string):Promise<this> {
        await this.patch(`/api/database/tables/${this._DATA?.id}/`,{},{name},{});
        if (this._DATA) this._DATA.name = name;
        return this;
    }
    build(): {
        infos?: TABLE;
        fields?: ANY_FIELD[]; // todo create builder
    } {
        return {
            infos: this._DATA,
            fields: this._FIELDS
        }
    }
}