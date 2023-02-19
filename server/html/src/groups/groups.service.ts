import { RestService } from "../services/rest.service";
import { Group } from "./group/group";

export class GroupsService {
    private static readonly REST_URL = "groups";

    constructor (private restService: RestService) {}

    public async getAllGroups(): Promise<Group[]> {
        return JSON.parse(await this.restService.get(GroupsService.REST_URL)) as Group[];
    }
}