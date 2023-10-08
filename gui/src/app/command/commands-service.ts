import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AbstractRestService } from "../abstract-rest.service";
import { NewCommandModel } from "./new-command-model";

@Injectable({
  providedIn: 'root'
})
export class CommandsService extends AbstractRestService {

  constructor(private http: HttpClient) {
    super();
  }

  public addCommand(command: NewCommandModel) {
    return this.http.put<HttpStatusCode>(this.getApiUrl("commands"), command);
  }
}
