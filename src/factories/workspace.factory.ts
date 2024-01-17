import type { connectionBuilder } from "../builders/connection.builder";
import { workspaceBuilder } from "../builders/workspace.builder";
import { brconnector } from "../connector/api.connector";
import type { BASEROW_SETUPS, BASEROW_USER } from "../types/setups";

export declare type WORKSPACE = {
    id: number;
    name: string;
    users: BASEROW_USER[][],
    order: number,
    permissions: string,
    unread_notifications_count: number
}
export class workspaceFactory extends brconnector {
    workspaces: workspaceBuilder[] = [];
    constructor(setups: BASEROW_SETUPS, connector:connectionBuilder) {
        super(setups, connector);
    }
    async list(filters: any, args: any, cache?:boolean) {
        if (cache && this.workspaces.length > 0) return;
        const res = await this.get("/api/workspaces/", {}, {}, "JWT", false);
        /* for (const entry of res) {
            this.workspaces.push(entry);
        } */
        this.workspaces = res.map((w:WORKSPACE) => {
            const space = new workspaceBuilder(w, this.setups, this.connector);
            space.listApps(cache);
            return space;
        });
        return this;
    }
    

    async create(name: string, args: any) {
        const res = await this.post(
            "/api/workspaces/",
            {},
            { name },
            {},
            "JWT",
            false);
        try {
            this.list({}, {})
        } catch (err) {
            throw err;
        }
        return res;
    }

    async rm(id: number, args: any) {
        const res = await this.del(
            `/api/workspaces/${id}/`,
            {},
            {},
            {},
            "JWT",
            false
        );
        try {
            this.list({}, {})
        } catch (err) {
            throw err;
        }
        return res;
    }

}