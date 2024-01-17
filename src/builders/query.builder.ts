import { brconnector } from "../connector/api.connector";
import type { tablesFactory } from "../factories/tables.factory";
import type { BASEROW_FILTER_ORDER, BASEROW_FILTER_TYPE } from "../factories/views.factory";
import type { BASEROW_SETUPS } from "../types/setups";
import type { connectionBuilder } from "./connection.builder";
import { rowBuilder } from "./row.builder";
import { tableBuilder } from "./table.builder";

export declare type BASEROW_RESULT = { 
    count: number;
    next?: string;
    previous?: string;
    results:{[key:string]:any}[],
    rows: rowBuilder[]
}
export declare type BASEROW_QUERY = {
    size: number;
    page: number;
    user_field_names?: boolean;
    search?: string;
    order_by?: string;
    filters?: string; //  {[key:string]:any};
    filter_type?: BASEROW_FILTER_TYPE;
    include?: string[] | string;
    exclude?: string[] | string;
    view_id?: number,
    fields?: string[]
}
export class queryBuilder extends brconnector {
    public table: tableBuilder | {id:number};
    public isLoading:boolean=false;
    public debounce: number = 200;
    private factory?: tablesFactory;
    private timeout?: ReturnType<typeof setTimeout>;
    public query: BASEROW_QUERY = {
        size:10,
        page:1,
        user_field_names: true,
        filters: undefined
    }
    private built:BASEROW_QUERY = {
        size:10,
        page:1,
        user_field_names: true,
        filters: undefined
    }
    public results: BASEROW_RESULT = {
        count: 0,
        results: [],
        rows:[]
     };
    constructor(
        q: Partial<BASEROW_QUERY>, 
        table: tableBuilder | {id:number}, 
        connector: connectionBuilder,
        factory?: tablesFactory) {
        super(connector._setups, connector);
        if(q) this.query = {...this.query, ...q};
        this.table = table;
        this.factory = factory;
    }
    reset(): this {
        this.query = {
            size:10,
            page:1,
            user_field_names: true
        };
        return this;
    }
    size(s?:number): this {
        if(!s) this.query.size = 10;
        else this.query.size = s; 
        return this;
    }
    page(s?:number): this {
        if(!s) this.query.page = 1;
        else this.query.page = s; 
        return this;
    }
    search(s?:string): this {
        if(!s) this.query.search = undefined;
        this.query.search = s; 
        return this;
    }
    order_by(field?:string, order?:BASEROW_FILTER_ORDER): this {
        if (!field) this.query.order_by = undefined;
        else this.query.order_by = (order && order === 'ASC' ? '-' : '+') + field;
        return this;
    }
    filter_type(f?:BASEROW_FILTER_TYPE): this {
        this.query.filter_type = f;
        return this;
    }
    addInclude(field:string): this{
        if (!this.query.include) this.query.include = [];
        if(!Array.isArray(this.query.include)) this.query.include = this.query.include?.split(',');
        (this.query.include as string[]).push(field);
        this.query.include.filter((value, index, self) => self.indexOf(value) === index);
        return this;
    }
    removeInclude(field:string): this{ 
        if (!this.query.include) this.query.include = [];
        if(!Array.isArray(this.query.include)) this.query.include = this.query.include?.split(',');
        this.query.include.filter(f => f !== field);
        return this;
    }
    include(str?:string | string[]): this {
        if (this.table && this.table instanceof tableBuilder && this.table.fields) {
            const fields = this.table.fields.map(f => f.field.name);
            str = Array.isArray(str) ? str : str?.split(',').filter(e => fields.includes(e));
        }
        this.query.include = Array.isArray(str) ? str : str?.split(',');
        return this;
    }
    addExclude(field:string): this{
        if (!this.query.exclude) this.query.exclude = [];
        if(!Array.isArray(this.query.exclude)) this.query.exclude = this.query.exclude?.split(',');
        this.query.exclude.push(field);
        this.query.exclude.filter((value, index, self) => self.indexOf(value) === index);
        return this;
    }
    removeEclude(field:string) :this{
        if (!this.query.exclude) this.query.exclude = [];
        if(!Array.isArray(this.query.exclude)) this.query.exclude = this.query.exclude?.split(',');
        this.query.exclude.filter(f => f !== field);
        return this;
    }
    exclude(str?:string | string[]): this {
        this.query.exclude = Array.isArray(str) ? str : str?.split(',');
        return this;
    }
    view_id(id?:number): this {
        this.query.view_id = id;
        return this;
    }
    filter = new FilterBuilder({
        filters:[],
        groups:[]
    });
    build() : this{
        this.built = JSON.parse(JSON.stringify(this.query));
        this.built.include = this.built.include ? 
            Array.isArray(this.built.include) ?
                this.built.include.join(',') : 
                this.built.include :
            undefined;
        this.built.exclude = this.built.exclude ? 
            Array.isArray(this.built.exclude) ?
                this.built.exclude.join(',') : 
                this.built.exclude :
            undefined;
        const filter = this.filter.build();
        if (filter.filters.length > 0 ||
            (
                filter.groups.length > 0 && 
                filter.filter_type
            ))
            this.built.filters = JSON.stringify(filter);
        return this;
    }
    async prev(join:boolean, auth?:string) : Promise<BASEROW_RESULT> {
        //if (!this.factory) throw 'need factory';
        if (this.timeout) clearTimeout(this.timeout);
        return new Promise((resolve, reject) => {
            if (this.isLoading)this.cancel();
            this.timeout = setTimeout(async ()=>{
                try{
                    if (this.results && this.results.previous) {
                        this.isLoading = true;
                        const res = await this.get(this.results.previous,
                            {},
                            {},
                            auth ?? 'Token',
                            false)
                        if (join) {
                            this.results.count = res.count;
                            this.results.previous = res.previous;
                            this.results.next = res.next;
                            this.results.results = [...this.results.results, ...res.results]
                                .filter((value, index, self) => self.indexOf(value) === index);
                        } else this.results = res;
                        this.isLoading = false;
                    }
                    this.results.rows = this.results.results.map(r => {
                        return new rowBuilder(r, this.table, this.factory!, this.setups, this.connector);
                    });
                    resolve(this.results);
                } catch(err) {
                    reject(err);
                }
            },  this.debounce);
        })
    }
    async next(join:boolean, auth?:string) : Promise<BASEROW_RESULT>{
        //if (!this.factory) throw 'need factory';
        if (this.timeout) clearTimeout(this.timeout);
        return new Promise((resolve, reject) => {
            if (this.isLoading)this.cancel();
            this.timeout = setTimeout(async ()=>{
                try {
                    if (this.results && this.results.next) {
                        this.isLoading = true;
                        const res = await this.get(this.results.next,
                            {},
                            {},
                            auth ?? 'Token',
                            false)
                        if (join) {
                            this.results.count = res.count;
                            this.results.previous = res.previous;
                            this.results.next = res.next;
                            this.results.results = [...this.results.results, ...res.results]
                                .filter((value, index, self) => self.indexOf(value) === index);
                        } else this.results = res;
                        this.isLoading = false;
                    }
                    this.results.rows = this.results.results.map(r => {
                        return new rowBuilder(r, this.table, this.factory!, this.setups, this.connector);
                    });
                    resolve(this.results);
                }catch(err) {
                    reject(err);
                }
            }, this.debounce);
        });
    }
    async scroll(auth?:string): Promise<BASEROW_RESULT> {
        //if (!this.factory) throw 'need factory';
        if (this.timeout) clearTimeout(this.timeout);
        
        return new Promise((resolve, reject) => {
            if (this.isLoading) this.cancel();
            this.timeout = setTimeout(async ()=>{
                try {
                    this.build();
                    this.isLoading = true;
                    const res = await this.get(`/api/database/rows/table/${this.table.id}/`,
                        // @ts-ignore
                        this.built as {[key:string]:string | string[]},
                        {},
                        auth ?? 'Token',
                        false);
                    this.results = res;
                    this.isLoading = false;
                    if (Array.isArray(this.results.results)) {
                        this.results.rows = this.results.results.map(r => {
                            return new rowBuilder(r, this.table, this.factory!, this.setups,  this.connector);
                        });
                    }
                    resolve(this.results);
                } catch(err) {
                    reject(err);
                }
            }, this.debounce);
        });
    }
}

/** 
 * types : 
 * equal, 
 * not_equal, 
 * filename_contains, 
 * files_lower_than,
 * has_file_type, 
 * contains, 
 * contains_not, 
 * contains_word, 
 * doesnt_contain_word, 
 * length_is_lower_than, 
 * higher_than, 
 * lower_than, 
 * is_even_and_whole, 
 * date_equal, 
 * date_before, 
 * date_before_or_equal, 
 * date_after_days_ago, 
 * date_after, 
 * date_after_or_equal, 
 * date_not_equal, 
 * date_equals_today, 
 * date_before_today, 
 * date_after_today, 
 * date_within_days, 
 * date_within_weeks, 
 * date_within_months, 
 * date_equals_days_ago, 
 * date_equals_months_ago, 
 * date_equals_years_ago, 
 * date_equals_week, 
 * date_equals_month, 
 * date_equals_day_of_month, 
 * date_equals_year, 
 * single_select_equal, 
 * single_select_not_equal, 
 * link_row_has, 
 * link_row_has_not, 
 * link_row_contains, 
 * link_row_not_contains, 
 * boolean, 
 * empty, 
 * not_empty, 
 * multiple_select_has, 
 * multiple_select_has_not, 
 * multiple_collaborators_has, 
 * multiple_collaborators_has_not, 
 * user_is, 
 * user_is_not.
 **/ 
export enum BASEROW_QUERY_TYPE {
    "equal", 
    "not_equal", 
    "filename_contains", 
    "files_lower_than",
    "has_file_type", 
    "contains", 
    "contains_not", 
    "contains_word", 
    "doesnt_contain_word", 
    "length_is_lower_than", 
    "higher_than", 
    "lower_than", 
    "is_even_and_whole", 
    "date_equal", 
    "date_before", 
    "date_before_or_equal", 
    "date_after_days_ago", 
    "date_after", 
    "date_after_or_equal", 
    "date_not_equal", 
    "date_equals_today", 
    "date_before_today", 
    "date_after_today", 
    "date_within_days", 
    "date_within_weeks", 
    "date_within_months", 
    "date_equals_days_ago", 
    "date_equals_months_ago", 
    "date_equals_years_ago", 
    "date_equals_week", 
    "date_equals_month", 
    "date_equals_day_of_month", 
    "date_equals_year", 
    "single_select_equal", 
    "single_select_not_equal", 
    "link_row_has", 
    "link_row_has_not", 
    "link_row_contains", 
    "link_row_not_contains", 
    "boolean", 
    "empty", 
    "not_empty", 
    "multiple_select_has", 
    "multiple_select_has_not", 
    "multiple_collaborators_has", 
    "multiple_collaborators_has_not", 
    "user_is", 
    "user_is_not"
}
export declare type BASEROW_FILTER_SCHEME = {
    filter_type?:string;
    filters: {
        field:string;
        type:string;
        value:string;
    }[],
    groups: (BASEROW_FILTER_SCHEME | FilterBuilder)[]
}
export class FilterBuilder {
    public filters: BASEROW_FILTER_SCHEME = {
        filters:[],
        groups:[]
    }
    constructor(f:BASEROW_FILTER_SCHEME) {

    }
    clear() {
        this.filters = {
            filters:[],
            groups:[]
        };
    }
    group():FilterBuilder {
        const group = new FilterBuilder({
            filters:[],
            groups:[]
        });
        this.filters.groups.push(group);
        return group;
    }
    filter_type(filter_type:string):this {
        this.filters.filter_type = filter_type
        return this;
    }
    add(field: string,  type: string | BASEROW_QUERY_TYPE,  value:  any):this {
        this.filters.filters.push({
            field, 
            type: type as string, 
            value
        })
        return this;
    }
    remove(field:string) {
        this.filters.filters = this.filters.filters.filter(k => k.field !== field);
    }
    buildQuery() {
        return this.filters.filters.reduce((o, f) => {
            o.push(`filter__${f.field}__${f.type}=${f.value}`);
            return o;
        }, [] as string[])
    }
    build(): BASEROW_FILTER_SCHEME {
        const output: BASEROW_FILTER_SCHEME = {
            filter_type: this.filters.filter_type,
            filters: this.filters.filters,
            groups: this.filters.groups.map(g => {
                if (g instanceof FilterBuilder)
                    return g.build()
                else return g;
            })
        };
        return output;
    }
}



