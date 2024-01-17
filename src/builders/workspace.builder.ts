import { brconnector } from "../connector/api.connector";
import { applicationFactory } from "../factories/application.factory";
import type { WORKSPACE, workspaceFactory } from "../factories/workspace.factory";
import type { BASEROW_SETUPS } from "../types/setups";
import { appBuilder } from "./app.builder";
import type { connectionBuilder } from "./connection.builder";

export class workspaceBuilder extends brconnector{
    applications: applicationFactory;
    workspace: WORKSPACE;
    constructor(
        workspace: WORKSPACE, 
        setups:BASEROW_SETUPS, 
        connector:connectionBuilder) {
        super(setups, connector);
        this.workspace = workspace;
        this.applications = new applicationFactory(connector, this.setups, this);
    }
    async listApps(cache?:boolean): Promise<this> {
        if (cache) return this;
        try{
            await this.applications.list(cache);
            return this;
        }catch(err){
            throw err;
        }
    }
    async createApplication(name:string) {
        try{
            /* const app = await this.post(`/api/applications/workspace/${this.workspace.id}/`, {}, {
                name:name,
                type: 'database',
                init_with_data: false
            }, {}); */
            return await this.applications.create(name, {});
        }catch(err){
            throw err;
        }
    }
    async update(name:string) {
        try{
            await this.patch(`/api/workspaces/${this.workspace.id}/`, {}, {
                name:name
            }, {});
        }catch(err){
            throw err;
        }
    }
    
}