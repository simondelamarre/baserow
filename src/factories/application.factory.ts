import { appBuilder } from "../builders/app.builder";
import type { connectionBuilder } from "../builders/connection.builder";
import type { workspaceBuilder } from "../builders/workspace.builder";
import { brconnector } from "../connector/api.connector";
/*import { get } from "../types/decorators/methods"; */
import type { BASEROW_SETUPS, ERROR_HANDLER } from "../types/setups";

export declare type GROUP = {
    id: number;
    name: string;
}
export declare type TABLE = {
    id: number;
    name: string;
    order: number;
    database_id: number;
}
export declare type APPLICATION = {
    id: number;
    name: string;
    type: string;
    group: GROUP;
    workspace: GROUP
    order: number;
    tables: TABLE[];
}
export class applicationFactory extends brconnector {
    applications: APPLICATION[] = [];
    apps: appBuilder[] = [];
    workspace?: workspaceBuilder;
    constructor(connector: connectionBuilder, setups: BASEROW_SETUPS,  workspace?:workspaceBuilder) {
        super(setups, connector);
        this.workspace = workspace;
    }
    async list(cache?:boolean): Promise<this> {
        if (cache && this.apps.length > 0) return this;
        try {
            const url:string = this.workspace && this.workspace.workspace.id ?
                `/api/applications/workspace/${this.workspace.workspace.id}/` :
                "/api/applications/";
            const res = await this.get(
                url,
                {},
                {}
            );
            this.applications = res;
            this.apps = [];
            for (const a of this.applications as APPLICATION[]) {
                const builder = new appBuilder(this, a, this.setups, this.connector);
                this.apps.push(builder)
            }
            return this;
        } catch (err: ERROR_HANDLER) {
            throw err;
        }
    }

    async create(name: string, args?: any): Promise<appBuilder> {
        try {
            const res = await this.post(
                `/api/applications/workspace/${this.workspace?.workspace.id}/`,
                {},
                { 
                    name,
                    "type": "database",
                    "init_with_data": false
                },
                {}
            );
            const builder = new appBuilder(this, res, this.setups, this.connector);
            //this.list()
            return builder;
        } catch (err: ERROR_HANDLER) {
            throw err;
        }
    }

    async rm(id: number, args?: any): Promise<any> {
        try {
            const res = await this.del(`/api/applications/${id}/`, {}, {}, {});
            // this.list();
            this.apps = this.apps.filter(app => app.app.id !== id);
            this.applications = this.applications.filter(app => app.id !== id);
            return res;
        } catch (err: ERROR_HANDLER) {
            throw err;
        }
    }
}