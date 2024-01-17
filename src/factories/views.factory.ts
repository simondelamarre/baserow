import type { connectionBuilder } from "../builders/connection.builder";
import type { tableBuilder } from "../builders/table.builder";
import { brconnector } from "../connector/api.connector";
import type { BASEROW_SETUPS } from "../types/setups";
import type { TABLE } from "./tables.factory";

export class viewsFactory extends brconnector{
    public table: tableBuilder;
    constructor(table: tableBuilder, setups: BASEROW_SETUPS, connector:connectionBuilder) {
        super(setups, connector);
        this.table = table;
    }
    list() {
        // https://api.baserow.io/api/database/views/table/{table_id}/
        try {
            this.get(`api/database/views/table/${this.table._DATA!.id}/`, {}, {});
        } catch(err) {
            throw err;
        }
    }
}




export enum BASEROW_FILTER_TYPE {
    AND = 'AND',
    OR = 'Or'
}
export enum BASEROW_FILTER_ORDER {
    ASC = 'ASC',
    DESC = 'DESC'
}


export declare type BASEROW_FILTER ={
    id: number;
    view: number;
    field: number;
    type: string;
    value: string;
    preload_values: {
      [key:string]:any
    };
    group: number;
}
export declare type BASEROW_FILTER_GROUP ={
    id: number;
    filter_type: string;
    view: number;
}
export declare type BASEROW_SORTING = {
    id: number;
    view: number;
    field: number;
    order: BASEROW_FILTER_ORDER; // ASC  | DESC
}
export declare type BASEROW_GROUP_BY = {
    id: number;
    view: number;
    field: number;
    order: BASEROW_FILTER_ORDER; // ASC  | DESC
}
export declare type BASEROW_DECORATION = {
    id: number;
    view: number;
    type: string;
    value_provider_type: string;
    value_provider_conf: {
      [key:string]: any;
    },
    order: number;
}
export declare type VIEW = [
    {
      id: number;
      table_id: number;
      name: string;
      order: number;
      type: string;
      table: Partial<TABLE>,
      filter_type: BASEROW_FILTER_TYPE; // AND | OR
      filters: BASEROW_FILTER[];
      filter_groups: BASEROW_FILTER_GROUP[];
      sortings: BASEROW_SORTING[];
      group_bys: BASEROW_GROUP_BY[];
      decorations: BASEROW_DECORATION[],
      filters_disabled: boolean;
      public_view_has_password: boolean;
      show_logo: boolean;
      ownership_type: string;
      owned_by_id: number;
      row_identifier_type: string; // 'ID' 'id'
      public: boolean;
      slug: string;
    }
  ]