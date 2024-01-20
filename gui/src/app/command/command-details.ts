import { CommandBasicInfo } from "./command-basic-info";

export interface CommandDetails extends CommandBasicInfo {
    script: string;
}