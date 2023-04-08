import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNil } from 'lodash-es';
import { MessageService } from 'primeng/api';
import { Observable, filter, map, tap } from 'rxjs';
import { EditGroupDto } from '../edit-group-dto';
import { Group } from '../group';
import { GroupsService } from '../groups.service';


@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent {
  public group$: Observable<Group>;

  public newGroupName: string = "";

  private groupId: string = "";

  constructor(private route: ActivatedRoute, private groupsService: GroupsService, private messageService: MessageService) {
    this.group$ = this.route.paramMap.pipe(
      map(params => params.get("id")),
      filter((id) => !isNil(id)),
      tap(id => this.groupId = id || ""),
      map(id => ({ id } as Group))
    );
  }

  public addNewGroup() {
    const newGroup: EditGroupDto = {
      name: this.newGroupName,
      parentId: this.groupId
    };
    this.groupsService.addGroup(newGroup).subscribe(() => {
      this.messageService.add({ severity: "success", summary: "Success", detail: `Group "${this.newGroupName}" added.` });
      this.newGroupName = "";
    }, (error) => {
      this.messageService.add({ severity: "error", summary: "Error", detail: error.error });
    });
  }
}
