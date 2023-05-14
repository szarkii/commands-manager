import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { map } from 'rxjs';
import { CommandBasicInfo } from 'src/app/command/command-basic-info';
import { GroupTreeNode } from '../group-tree-node';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit {
  public selectedNode: TreeNode = {};

  private groupsTreeNode: TreeNode[] = [];

  constructor(private router: Router, private groupsService: GroupsService) {
  }

  ngOnInit(): void {
    this.groupsService.getGroupsTree()
      .pipe(map((groups: GroupTreeNode[]) => this.mapGroupsToTree(groups)))
      .subscribe((tree: TreeNode[]) => {
        this.groupsTreeNode = tree;
      });
  }

  private mapGroupsToTree(groups: GroupTreeNode[]): TreeNode[] {
    const tree: TreeNode[] = [];

    groups.forEach((group: GroupTreeNode) => {
      const node: TreeNode = {
        label: group.name,
        icon: "pi pi-box",
        data: {
          isCommand: false,
          id: group.id
        }
      };

      if (group.subgroups && group.subgroups.length) {
        node.children = this.mapGroupsToTree(group.subgroups);
      }

      if (group.commands && group.commands.length) {
        node.children = group.commands.map((command: CommandBasicInfo) => ({
          label: command.name,
          icon: "pi pi-code",
          data: {
            isCommand: true,
            id: command.id
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

  public redirect() {
    const route = this.selectedNode.data.isCommand ? "commands" : "groups";
    this.router.navigate(["/", route, this.selectedNode.data.id]);
  }
}
