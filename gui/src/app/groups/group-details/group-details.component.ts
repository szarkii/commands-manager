import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, combineLatest, map } from 'rxjs';
import { Group } from '../group';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent {
  public allGroups$: Observable<Group[]>;
  public currentGroup$: Observable<Group>;

  public newGroupModel: Group = {} as Group;
  public editGroupModel: Group = {} as Group;

  constructor(private route: ActivatedRoute, private groupsService: GroupsService, private messageService: MessageService) {
    // TODO Differentiate duplicates
    this.allGroups$ = this.groupsService.getAllGroups();

    const currentGroupId$: Observable<string> = this.route.paramMap.pipe(
      map(params => params.get("id") as string)
    );

    this.currentGroup$ = combineLatest([currentGroupId$, this.allGroups$]).pipe(
      map(([currentGroupId, allGroups]) => {
        const currentGroup = allGroups.find((group: Group) => group.id === currentGroupId);
        const parentGroup = allGroups.find((group: Group) => group.id === currentGroup?.parentId);

        this.newGroupModel.parentId = currentGroupId;

        this.editGroupModel.id = currentGroupId;
        this.editGroupModel.name = currentGroup?.name || "";
        this.editGroupModel.parentId = parentGroup?.id;

        return currentGroup;
      })
    ) as Observable<Group>;
  }

  public addNewGroup() {
    this.groupsService.addGroup(this.newGroupModel).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Success", detail: `Group "${this.newGroupModel.name}" added.` });
        this.newGroupModel.name = "";
      }, error: (error) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: error.error });
      }
    });
  }

  public editGroup() {
    this.groupsService.editGroup(this.editGroupModel).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Success", detail: `Group "${this.editGroupModel.name}" changed.` });
      }, error: (error) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: error.error });
      }
    });
  }
}
