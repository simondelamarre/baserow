import { brconnector } from "../connector/api.connector"
import type { tablesFactory } from "../factories/tables.factory";
import type { BASEROW_SETUPS } from "../types/setups"
import type { connectionBuilder } from "./connection.builder";
import { fieldBuilder } from "./field.builder";
import { historyBuiler } from "./history.builder";
import { tableBuilder } from "./table.builder";


export class rowBuilder extends brconnector {
    public _DATA: {[key:string]:any};
    private table: tableBuilder | {id:number};
    private factory: tablesFactory;
    public fields: fieldBuilder[];
    public history: historyBuiler;
    public h?: historyBuiler;
    constructor(
        row:{[key:string]:any}, 
        table: tableBuilder | {id:number},
        factory: tablesFactory,
        setups: BASEROW_SETUPS,
        connector: connectionBuilder
    ) {
        super(setups, connector);
        this._DATA = row;
        this.table = table;
        this.factory = factory;
        this.fields = [];
        if (this.table && this.table instanceof tableBuilder && this.table._FIELDS) {
            for (const field of this.table._FIELDS) {
                const f = new fieldBuilder(
                    field, 
                    this.table, 
                    this.setups,
                    this.connector, 
                    this.factory, 
                    field.type, 
                    this, 
                    this._DATA[field.name]?.value
                );
                this.fields.push(f);
            }
        }
        this.history = new historyBuiler(this._DATA.id, this.table.id, this.connector);
        this.h = this.history;
        if (this.connector.live) {
            this.connector.auth.listen(
                {
                    "page": "table",
                    "table_id": this.table.id,
                    "row_id": row.id
                },
                this.onmessage.bind(this)
            );
        }
    }
    onmessage(msg:any) {
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
                    break;
                case "rows_created":
                case "rows_updated":
                case "rows_deleted":
                case "before_rows_update":
                case "before_rows_delete":
                case "row_history_updated":
                    if  (data.rows && Array.isArray(data.rows)) {
                        for(const row of data.rows) {
                            if (row.id === this._DATA.id) {
                                for (const field of this.fields) {
                                    try {
                                        // this._DATA[field.field.name] = row['field_'+field.field.id];
                                        field.value = row['field_'+field.field.id];
                                        this.build();
                                    } catch(err) {
                                    } 
                                }
                            }
                        }
                    }
                    break;
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
        } catch(err) {
        }
    }
    async update(news:{[key:string]:any}, auth:string='Token') {
        // todo prevent useless updates
        if (this._DATA != news) {
            this._DATA = {...this._DATA, ...news};
            await this.patch(`/api/database/rows/table/${this.table.id}/${this._DATA.id}/?user_field_names=true`, 
                {}, 
                news, 
                {}, 
                auth);
        }
    }
    async delete() {
        await this.del(
            `/api/database/rows/table/${this.table.id}/${this._DATA.id}/`, 
            {}, 
            {}, 
            {}
        )
        // this.table.builder.scroll()
    }
    build() {
        for (const field of this.fields) {
            this._DATA[field.field.name] = field.value;
        }
        return this._DATA;
    }
}