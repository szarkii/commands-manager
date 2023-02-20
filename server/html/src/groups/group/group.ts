import { CommandBasicInfo } from "../../commands/command-basic";

export interface Group {
    id: string
    parentId?: string
    name: string;
    subgroups: Group[];
    commands?: CommandBasicInfo[];
}