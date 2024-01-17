export declare type NODES = {
    id: string;
    label: string;
    type?: string;
    data?: { [key: string]: any },
    position?: { x: number, y: number },
    class?: string
} & { [key: string]: any }
