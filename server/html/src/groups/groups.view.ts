import { AbstractView } from "../view/abstract.view";
import { QueryElementService } from "../services/query-element.service";
import { GroupsService } from "./groups.service";
import { OnInit } from "../view/on-init";
import { Group } from "./group/group";
import { HtmlElementsUtils } from "../services/html/html-elements-utils";

enum HtmlId {
    List = "groups-list"
}

export class GroupsView extends AbstractView implements OnInit {
    private groupsListElement: HTMLUListElement;

    constructor(queryElementService: QueryElementService, private groupsService: GroupsService) {
        super(queryElementService);
    }

    public onInit() {
        this.groupsListElement = this.queryElementService.getById(HtmlId.List) as HTMLUListElement;
    }

    public async loadGroups() {
        const groups = await this.groupsService.getAllGroups();
        groups.forEach((group: Group) => {
            this.renderGroup(this.groupsListElement, group);
        });
    }

    private renderGroup(parent: HTMLElement, group: Group, level: number = 1) {
        const itemsGroup = HtmlElementsUtils.createDiv();
        const listItem = HtmlElementsUtils.createListItem(group.name);
        
        itemsGroup.appendChild(listItem);
        listItem.className += " ps-" + (level + 2);
        parent.appendChild(itemsGroup);
        
        (group.subgroups || []).forEach(subgroup => this.renderGroup(itemsGroup, subgroup, level + 1));
    }
}
