
import { brconnector } from "../connector/api.connector";
import type { connectionBuilder } from "./connection.builder";

export declare type BASEROW_ROW_HISTORY= {
    id: number;
    action_type: string;
    user: any;
    timestamp: string;
    before: {[key:string]:any};
    after: {[key:string]:any};
    fields_metadata:any
}
export declare type BASEROW_ROW_HISTORY_RESULT = {
    count:number;
    next:string;
    previous: string;
    results: BASEROW_ROW_HISTORY[]
}

export class historyBuiler extends brconnector {
    public history?: BASEROW_ROW_HISTORY_RESULT;
    private _limit: number = 10;
    private _offset: number = 1;
    private row_id: number;
    private table_id: number;
    constructor(row_id:number, table_id:number, connexion: connectionBuilder) {
        super(connexion._setups, connexion);
        this.table_id= table_id;
        this.row_id=row_id
    }
    get limit(): number {
        return this._limit;
    }
    size(l:number): this {
        this._limit = l;
        return this;
    }
    get offset(): number {
        return this.offset;
    }
    page(l:number): this {
        this._offset = l;
        return this;
    }
    async scroll(): Promise<BASEROW_ROW_HISTORY_RESULT> {
        const res =  await this.get(`/api/database/rows/table/${this.table_id}/${this.row_id}/history/`, {
            limit: this._limit.toString(),
            offset: this._offset.toString(),
            user_field_names: 'true'
        }, {})
        this.history = res;
        return res;
    }
    async prev(): Promise<BASEROW_ROW_HISTORY_RESULT> {
        if(!this.history || !this.history.previous) throw 'no prev link';
        const res = await this.get(this.history?.previous, {}, {});
        this.history.previous = res.results.previous;
        this.history.results = [...this.history.results, ...res.results];
        return res;
    }
    async next(): Promise<BASEROW_ROW_HISTORY_RESULT> {
        if(!this.history || !this.history.next) throw 'no next link';
        const res = await this.get(this.history?.next, {}, {});
        this.history.next = res.results.next;
        this.history.results = [...res.results, ...this.history.results];
        return res;
    }
}