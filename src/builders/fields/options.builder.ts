import type { tablesFactory } from "../../factories/tables.factory";
import type { FIELD_OPTION_SELECT } from "../../types/fields";
import type { tableBuilder } from "../table.builder";

export class optionsBuilder {
    public options?: FIELD_OPTION_SELECT[]
    constructor(options?: FIELD_OPTION_SELECT[]) {
        this.options = options;
    }
    add(option:Omit<FIELD_OPTION_SELECT, 'id'>): this {
        if (!this.options)  this.options = [];
        this.options.push(option);
        return this;
    }
    remove(option:FIELD_OPTION_SELECT): this {
        if (!this.options)  this.options = [];
        this.options = this.options.filter(opt => opt !== option);
        return this;
    }
    build() {
        return this.options;
    }
}