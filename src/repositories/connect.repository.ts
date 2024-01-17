import type { AxiosError } from "axios";
import { brconnector } from "../connector/api.connector";
import type { BASEROW_SETUPS, BASEROW_SETUPS_TYPE, BASEROW_USER } from "../types/setups";
import type { connectionBuilder } from "../builders/connection.builder";


export class brconnect extends brconnector {
    private live:boolean;
    public socket?:WebSocket;
    public listeners:((msg:any)=>void)[] = []
    constructor(
        setups: BASEROW_SETUPS,
        builder: connectionBuilder,
        live: boolean
    ) {
        super(setups, builder);
        this.live = live
    }
    socketMessage(msg:MessageEvent) {}
    socketConnected(s:any)  {}
    sockerClosed(s:any)  {}
    listen(data:any, listener:(msg:any)=>void) {
        if (!this.socket) return;
        this.listeners.push(listener);
        this.socket.addEventListener("message", listener)
        this.socket.send(JSON.stringify(data))
    }
    removeListener(listener:()=>void) {
        if (!this.socket) return;
        this.socket.removeEventListener("message", listener)
        this.listeners = this.listeners.filter(l => l !== listener);
    }
    async connect(): Promise<BASEROW_USER> {
        try {
            const user = await this.post(
                "/api/user/token-auth/",
                {},
                {
                    "email": this.setups.data.email,
                    "username": this.setups.data.username,
                    "password": this.setups.data.password
                }, {}
            ) as BASEROW_USER;
            this.setups.refresh_token = user.refresh_token;
            this.setups.jwt = user.token;
            this.setups.user = user;
            if (this.live) {
                this.socket = new WebSocket(`wss://api.baserow.io/ws/core/?jwt_token=${user.token}`)
                this.socket.onopen = this.socketConnected.bind(this);
                this.socket.onmessage = this.socketMessage.bind(this);
                this.socket.onclose = this.sockerClosed.bind(this);
            }
            return this.setups.user
        } catch (error: any | Error | AxiosError) {
            throw Error("ERROR:" + error.message)
        }
    }
    public async refreshToken() {
        const refreshed = await this.post('/api/user/token-refresh/', {}, {
            refresh_token: this.setups.data.refresh_token
        }, {});
        this.setups.user = refreshed;
        this.setups.jwt = refreshed.token;
        this.setups.refresh_token = refreshed.refresh_token;
    }
}