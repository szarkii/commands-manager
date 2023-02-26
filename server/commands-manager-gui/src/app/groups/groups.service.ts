import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from "./group";

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  public getGroups():Observable<Group[]> {
    return this.http.get<Group[]>("http://localhost:8080/groups");
  }
}
