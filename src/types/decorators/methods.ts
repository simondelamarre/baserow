export declare type query = { [key: string]: any };
export declare type path = { [key: string]: any };
export declare type body = { [key: string]: any };
export declare type header = { [key: string]: any };
const get = (params?: { query?: query, path?: path }) => {
    return (target: any, memberName: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value() ?? {};
        descriptor.value = () => {
            return {
                ...originalMethod,
                ...params
            }
        }
    }
}
const put = (params?: { query?: query, path?: path, data?: body }) => {
    return (target: any, memberName: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value() ?? {};
        descriptor.value = () => {
            return {
                ...originalMethod,
                ...params
            }
        }
    }
}
const post = (params?: { query?: query, path?: path, data?: body }) => {
    return (target: any, memberName: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value() ?? {};
        descriptor.value = () => {
            return {
                ...originalMethod,
                ...params
            }
        }
    }
}
const patch = (params?: { query?: query, path?: path, data?: body }) => {
    return (target: any, memberName: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value() ?? {};
        descriptor.value = () => {
            return {
                ...originalMethod,
                ...params
            }
        }
    }
}
const del = (params?: { query?: query, path?: path, data?: body }) => {
    return (target: any, memberName: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value() ?? {};
        descriptor.value = () => {
            return {
                ...originalMethod,
                ...params
            }
        }
    }
}
export { get, post, put, patch, del };