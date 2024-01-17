import { connectionBuilder } from "./builders/connection.builder"
import type { BASEROW_SETUPS_TYPE } from "./types/setups"

export class baserow {
    public connectors: connectionBuilder[] = []
    constructor() { }
    connector(
        s: Omit<BASEROW_SETUPS_TYPE, "documentation" | "user">,
        live?: boolean
    ): connectionBuilder {
        const connected = this.connectors.find(c => {
            return (
                c._setups.data.email === s.email &&
                c._setups.data.password === s.password
            ) || c._setups.token === s.token;
        });
        if (connected) return connected;
        const builder = new connectionBuilder(s, live);
        this.connectors.push(builder);
        return builder;
    }
}
