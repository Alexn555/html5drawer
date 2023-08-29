export type SelectItem = {
    name: string;
    value: string | number;
}

export type SelectAttributes = {
    id: string;
    selected: string | number;
    content: SelectItem[];
    cb: Function;
}