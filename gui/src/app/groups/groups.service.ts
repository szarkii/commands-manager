import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractRestService } from "../abstract-rest.service";
import { EditGroupDto } from "./edit-group-dto";
import { Group } from "./group";

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends AbstractRestService {

  constructor(private http: HttpClient) {
    super();
  }

  public getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.getApiUrl("groups"));
  }

  public addGroup(group: EditGroupDto) {
    return this.http.put<HttpStatusCode>(this.getApiUrl("groups"), group);
  }
}
