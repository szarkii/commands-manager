import { CommandBasicInfo } from "../command/command-basic-info";

export interface Group {
    id: string
    parentId?: string
    name: string;
    subgroups: Group[];
    commands?: CommandBasicInfo[];
}