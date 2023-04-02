import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNil } from 'lodash-es';
import { Observable, filter, map, tap } from 'rxjs';
import { Group } from '../group';


@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent {
  public group$: Observable<Group>;

  public newGroupName: string = "";
  
  private groupId: string = "";

  constructor(private route: ActivatedRoute) {
    this.group$ = this.route.paramMap.pipe(
      map(params => params.get("id")),
      filter((id) => !isNil(id)),
      tap(id => this.groupId = id || ""),
      map(id => ({id} as Group))
    );
  }

  public addNewGroup() {
    console.log(this.newGroupName);
    console.log(this.groupId);
  }
}
