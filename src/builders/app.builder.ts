import { brconnector } from "../connector/api.connector";
import type { APPLICATION, applicationFactory } from "../factories/application.factory";
import { tablesFactory } from "../factories/tables.factory";
import type { BASEROW_SETUPS } from "../types/setups";
import type { connectionBuilder } from "./connection.builder";

export class appBuilder extends brconnector {
    public app:APPLICATION;
    public tables:tablesFactory;
    private factory: applicationFactory;
    constructor(
        factory: applicationFactory, 
        app_setup:APPLICATION, 
        setups:BASEROW_SETUPS,
        connector: connectionBuilder
    ) {
        super(setups, connector);
        this.app = app_setup;
        this.factory =  factory;
        this.tables = new tablesFactory(this, this.setups, this.connector);
    }
    async getTables(cache?:boolean): Promise<this> {
        if (cache && this.tables && this.tables.tables.length > 0) return this;
        return new Promise(async (resolve, reject) => {
            try {
                await this.factory.list(cache);
                await this.tables.list(this.app.tables.map(t => t.id));
                resolve(this);
            }catch(err) {
                reject(err);
            }
        });
    }
    name(str:string) {
        this.app.name = str;
        this.patch(`/api/applications/${this.app.name}/`, {}, {name:name}, {});
    }
    build() {
        return this.app;
    }
}