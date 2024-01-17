/* import { connectionBuilder } from "../builders/connection.builder";
import { brconnect } from "../repositories/connect.repository"; */
import type { connectionBuilder } from "../builders/connection.builder";
import type { BASEROW_SETUPS } from "../types/setups";
import axios, { AxiosError } from 'axios';
export class brconnector {
    public domain = "https://api.baserow.io";
    public data: any;
    public setups: BASEROW_SETUPS;
    public CancelToken = axios.CancelToken;
    public source = axios.CancelToken.source();
    public connector:connectionBuilder;
    // private brconnexion:brconnect
    constructor(setups: BASEROW_SETUPS, connector: connectionBuilder) {
        this.setups = setups;
        this.connector = connector;
        // this.brconnexion = new brconnect(setups, new connectionBuilder(setups.data));
    }
    // @get()
    public async get(
        url: string,
        queries: {[key:string]: string | string[]},
        headers: any,
        auth?: string,
        user?: boolean
    ): Promise<any> {
        
        const parsed = Object.keys(queries)
            .filter((key) => queries[key])
            .map((key) => `${key}=${queries[key]}`)
            .join('&');
        
        try {
            const res = await axios({
                method: "GET",
                url: this.domain+url.replace('http://', 'https://').replace(this.domain, '')+(parsed.length > 0 ? '?'+parsed : ''),
                cancelToken: this.source.token,
                headers: this.addHeaders(headers)
            })
            return res.data;
        } catch (err) {
            this.error(err);
            throw err;
        }
    }
    //@post()
    public async post(
        url: string,
        queries: any,
        data: any,
        headers: any,
        auth?: string,
        user?: boolean
    ): Promise<any | AxiosError> {
        try {
            const res = await axios({
                cancelToken: this.source.token,
                method: "POST",
                url: this.domain+url.replace(this.domain, ''),
                headers: this.addHeaders(headers),
                data: data
            })
            return res.data;
        } catch (error: any | Error | AxiosError) {
            if (url !== '/api/user/token-refresh/')
                this.error(error);
            throw error.message;
        }
    }
    public cancel(msg?: string) {
        this.source.cancel(msg ?? 'Operation canceled by the user.');
        this.source = axios.CancelToken.source();
    }
    public async put() {

    }
    public async patch(
        url: string,
        queries: any,
        data: any,
        headers: any,
        auth?: string,
        user?: boolean
    ) {
        try {
            const res = await axios({
                cancelToken: this.source.token,
                method: "PATCH",
                url: this.domain+url.replace(this.domain, ''),
                headers: this.addHeaders(headers, auth),
                data: data
            })
            return res.data;
        } catch (error: any | Error | AxiosError) {
            this.error(error);
            throw error;
        }
    }
    /* public async refreshToken() {
        const refreshed = await this.post('/api/user/token-refresh/', {}, {
            refresh_token: this.setups.data.refresh_token
        }, {});
        this.setups.data = refreshed;
        this.setups.jwt = refreshed.token;
        this.setups.refresh_token = refreshed.refresh_token;
    } */
    //@del()
    public async del(
        url: string,
        queries: any,
        data: any,
        headers: any,
        auth?: string,
        user?: boolean
    ) {
        try {
            const res = await axios.delete(
                this.domain+url.replace(this.domain, ''), 
                {
                    cancelToken: this.source.token,
                    headers: this.addHeaders(headers, auth),
                    data: data
                }
            );
            return res.data;
        } catch (err: any) {
            throw err;
        }
    }
    private error (err:any) {
        if (err instanceof AxiosError) {
            if (err.response?.status === 401) {
                this.connector.auth.refreshToken();
            }
        }
    }
    addHeaders(
        headers: { [key: string]: string | string[] },
        type: string = "JWT",
        user: boolean = false
    ) {
        return {
            ...headers,
            ...{
                Authorization: type === "JWT" ?
                    `JWT ${this.connector._setups.jwt}` :
                    `Token ${this.connector._setups.token}`,
                ClientSessionId: user ? this.setups?.data?.user?.user?.id : undefined
            }
        }
    }
}