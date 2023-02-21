import { AbstractView } from "../view/abstract.view";
import { QueryElementService } from "../services/query-element.service";
import { GroupsService } from "./groups.service";
import { OnInit } from "../view/on-init";
import { Group } from "./group/group";
import { HtmlBootstrapListElement } from "../services/html/bootstrap/html-bootstrap-list-element";
import { HtmlBootstrapLinkListElement } from "../services/html/bootstrap/html-bootstrap-link-list-element";
import { HtmlDivElement } from "../services/html/html-div-element";

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

    private renderGroup(parent: HTMLElement, group: Group, level: number = 0) {
        const itemsGroup = new HtmlDivElement().htmlElement;
        const listItem = new HtmlBootstrapListElement({ content: group.name });

        itemsGroup.appendChild(listItem.htmlElement);
        listItem.setLeftPadding(level + 2);
        parent.appendChild(itemsGroup);

        (group.subgroups || []).forEach(subgroup => this.renderGroup(itemsGroup, subgroup, level + 2));

        (group.commands || []).forEach(command => {
            const commandItem = new HtmlBootstrapLinkListElement({ content: command.name });
            commandItem.setLeftPadding(level + 4);
            parent.appendChild(commandItem.htmlElement);
        });
    }
}
