import type { applicationFactory,  APPLICATION } from "../factories/application.factory";
import { workspaceFactory } from "../factories/workspace.factory";
import { brconnect } from "../repositories/connect.repository";
import { BASEROW_SETUPS, type BASEROW_SETUPS_TYPE, type ERROR_HANDLER } from "../types/setups";
import type { appBuilder } from "./app.builder";
// import { tablesFactory } from "../factories/tables.factory";

export class connectionBuilder {
    public _setups: BASEROW_SETUPS = new BASEROW_SETUPS({});
    public auth: brconnect;
    public workspaces: workspaceFactory;
    public live:boolean = false;
    //public applications: applicationFactory;
    // public tables: tablesFactory;
    constructor(s: Omit<BASEROW_SETUPS_TYPE, "documentation" | "user">, live?:boolean) {
        this._setups.reset(s);
        this.live = live ?? false;
        this.auth = new brconnect(this._setups, this, live ?? false);
        this.workspaces = new workspaceFactory(this._setups, this);
    }
    public listApps(): APPLICATION[] {
        return []
    }
    public getApp(app_id:string|number): appBuilder | undefined {
        const workspace = this.workspaces.workspaces.find(ww => {
            return ww.applications.applications.find(app => {
                return app.id === parseInt(app_id.toString())
            })
        });
        if(!workspace) return undefined;
        return workspace.applications.apps.find(app => {
            return app.app.id === parseInt(app_id.toString())
        })
    }
    public async sync() {
        await this.workspaces.list({}, {}, false);
    }
    listen(data:any, listener:()=>void) {
        this.auth.socket?.addEventListener("message", listener);
        this.auth.socket?.send(JSON.stringify(data));
    }
    removeListener(listener:()=>void) {
        this.auth.socket?.removeEventListener("message", listener);
    }
    public async connect() {
        try {
            await this.auth.connect();
            /* if (this.live) {
                this.socket = new WebSocket(`wss://api.baserow.io/ws/core/?jwt_token=${this._setups.data.user?.token}`)
                this.socket.onopen = this.listen;
                this.socket.onmessage = this.observer
            } */
        } catch (err: ERROR_HANDLER) {
            throw err;
        }
    }
}