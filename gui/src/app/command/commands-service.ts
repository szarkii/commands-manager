import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AbstractRestService } from "../abstract-rest.service";
import { NewCommandModel } from "./new-command-model";
import { CommandDetails } from "./command-details";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommandsService extends AbstractRestService {

  constructor(private http: HttpClient) {
    super();
  }

  public getCommandDetails(commandId: string): Observable<CommandDetails> {
    return this.http.get<CommandDetails>(this.getApiUrl(["commands", commandId]));
  }

  public addCommand(command: NewCommandModel) {
    return this.http.put<HttpStatusCode>(this.getApiUrl("commands"), command);
  }
}
