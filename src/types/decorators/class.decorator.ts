const SubMethods = Symbol('SubMethods'); // just to be sure there won't be collisions

function ClassRequest(requestName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target[SubMethods] = target[SubMethods] || new Map();
        // Here we just add some information that class decorator will use
        

        target[SubMethods].set(propertyKey, requestName);
    };
}

function ClassListener<T extends { new(...args: any[]): {} }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
            const subMethods = Base.prototype[SubMethods];
            if (subMethods) {
                subMethods.forEach((requestName: string, method: string) => {
                    
                });
            }
        }
    };
}


export { ClassListener, ClassRequest }