import type { AxiosError } from "axios";
import { validate } from "./decorators/authenticate";

export declare type BASEROW_USER = {
    token: string,
    access_token: string,
    refresh_token: string;
    user: {
        first_name: string;
        username: string;
        is_staff: boolean;
        id: number;
        language: string;
        email_notification_frequency: string;
    };
    permissions: {
        name: string; // view_ownership, core, setting_operation, staff, member
        peermissions: any;
    }[];
    user_notifications: {
        unread_count: number;
    };
    active_licenses: {
        instance_wide: {
            all_saas_users: boolean;
        };
        per_workspace: any
    };
    saas: {
        accepted_terms_and_conditions: boolean
    }
}

export declare type BASEROW_SETUPS_TYPE = {
    token?: string;
    user_token?: string;
    jwt?: string;
    refresh_token?: string;
    email?: string;
    username?: string;
    password?: string;
    user?: BASEROW_USER;
    documentation: string;
}
export class BASEROW_SETUPS {
    public data : Partial<BASEROW_SETUPS_TYPE>;
    constructor(
        s: Omit<BASEROW_SETUPS_TYPE, "documentation" | "user">,
    ) {
        this.data = s;
        this.reset(s)
    }
    reset(s: Omit<BASEROW_SETUPS_TYPE, "documentation" | "user">) {
        this.data = {
            ...this.data,
            ...s,
            ...{
                documentation: "https://github.com/simondelamarre/baserowSDK"
            }
        }
    }
    set token(t: string) {
        this.data.user_token = t;
    }
    get token(): string {
        return this.data.user_token ?? "";
    }
    set refresh_token(t: string) {
        this.data.token = t;
    }
    get refresh_token(): string {
        return this.data.token ?? "";
    }
    set jwt(t: string) {
        this.data.jwt = t;
    }
    get jwt(): string {
        return this.data.jwt ?? "";
    }
    set user(t: BASEROW_USER) {
        this.data.user = t;
    }
    get user(): BASEROW_USER | undefined {
        return this.data.user;
    }
    public email(email: string): this {
        this.data.email = email;
        return this
    }
    public password(pwd: string): this {
        this.data.password = pwd;
        return this
    }
}

export declare type ERROR_HANDLER = any | Error | AxiosError;