import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractRestService } from "../abstract-rest.service";
import { Group } from "./group";
import { GroupTreeNode } from "./group-tree-node";

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends AbstractRestService {

  constructor(private http: HttpClient) {
    super();
  }

  public getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.getApiUrl("groups"));
  }

  public getGroupsTree(): Observable<GroupTreeNode[]> {
    return this.http.get<GroupTreeNode[]>(this.getApiUrl("groups&tree"));
  }

  public addGroup(group: Group) {
    return this.http.put<HttpStatusCode>(this.getApiUrl("groups"), group);
  }

  public editGroup(group: Group) {
    return this.http.post<HttpStatusCode>(this.getApiUrl("groups"), group);
  }

  public deleteGroup(groupId: string) {
    return this.http.delete<HttpStatusCode>(this.getApiUrl(["groups", groupId]));
  }
}
