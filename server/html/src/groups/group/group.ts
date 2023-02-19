export interface Group {
    id: string
    parentId?: string
    name: string;
    subgroups: Group[];
}