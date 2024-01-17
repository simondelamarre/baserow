// import "reflect-metadata";


function decodeJwt(token?: string): {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
} {
    if (!token) {
        throw new Error("NOT:CONNECTED")
    }

    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(atob(base64));
    } catch (err) {
        throw new Error("INVALID:JWT:ACCESS")
    }
}

function validate(target: any, memberName: string, descriptor: PropertyDescriptor) {
    //if (!brsetups || !brsetups.data.email || !brsetups.data.username || !brsetups.data.password)
    //    return false
    //throw new Error("UNKNOW:USER")
}
function deprecated(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalDef = descriptor.value;

    descriptor.value = function (...args: any[]) {
        return originalDef.apply(this, args);
    };
    return descriptor;
}

function Method(value: any) {

    return (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) => {
        const originalDef = descriptor.value;
        descriptor.value = (...args: any[]) => {
            // return descriptor.value.call(target, args);
            args.push({ foo: "bar", key: key })
            return originalDef.apply(target, args);
        }

        return descriptor;
    };
}

const authenticate = (type: string) => {
    var originalContext = this;
    return (target: any, memberName: string, descriptor: PropertyDescriptor) => {
        var originalMethod = descriptor.value;
        var originalContext = descriptor;
        var originalTarget = target;
        
    }
}


const parameterDecorator = (target: any, methodName: string, position: number) => {

}

export { deprecated, authenticate, validate, parameterDecorator, Method };