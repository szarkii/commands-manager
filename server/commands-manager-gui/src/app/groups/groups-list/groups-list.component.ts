import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs';
import { CommandBasicInfo } from 'src/app/command/command-basic-info';
import { Group } from '../group';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit {
  public selectedNode: TreeNode = {};

  private groupsTreeNode: TreeNode[] = [];

  constructor(private groupsService: GroupsService) {
  }

  ngOnInit(): void {
    this.groupsService.getGroups()
      .pipe(map((groups: Group[]) => this.mapGroupsToTree(groups)))
      .subscribe((tree: TreeNode[]) => {
        this.groupsTreeNode = tree;
      });
  }

  private mapGroupsToTree(groups: Group[]): TreeNode[] {
    const tree: TreeNode[] = [];

    groups.forEach((group: Group) => {
      const node: TreeNode = {
        label: group.name,
        icon: "pi pi-box",
        data: {
          isCommand: false
        }
      };

      if (group.subgroups) {
        node.children = this.mapGroupsToTree(group.subgroups);
      }

      if (group.commands) {
        node.children = group.commands.map((command: CommandBasicInfo) => ({
          label: command.name,
          icon: "pi pi-code",
          data: {
            isCommand: true
          }
        }));
      }

      tree.push(node);
    });

    return tree;
  }

  public get groupsTree(): TreeNode[] {
    return this.groupsTreeNode;
  }

  public redirectToCommand() {
    console.log(this.selectedNode);
  }
}
