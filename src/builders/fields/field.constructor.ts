import type { tablesFactory } from "../../factories/tables.factory";
import type { ANY_FIELD } from "../../types/fields";
import type { tableBuilder } from "../table.builder";
import type { optionsBuilder } from "./options.builder";

export class  fieldConstructor {
    public field: ANY_FIELD;
    public table:tableBuilder;
    public tables:tablesFactory;
    public options?: optionsBuilder;
    constructor(table:tableBuilder, tables:tablesFactory, field:ANY_FIELD) {
        this.table=table;
        this.tables=tables;
        this.field = field;
    }
    build() {
        return this.field
    }
}