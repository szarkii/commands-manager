import { CommandBasicInfo } from "../command/command-basic-info";

export interface GroupTreeNode {
    id: string
    parentId?: string
    name: string;
    subgroups: GroupTreeNode[];
    commands?: CommandBasicInfo[];
}