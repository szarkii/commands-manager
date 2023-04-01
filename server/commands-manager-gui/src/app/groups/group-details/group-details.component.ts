import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, of, tap } from 'rxjs';
import { Group } from '../group';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent {
  public group$: Observable<Group>;

  constructor(private route: ActivatedRoute) {
    this.group$ = this.route.paramMap.pipe(
      map(params => params.get("id")),
      map(id => ({id} as Group)),
    );
  }
}
