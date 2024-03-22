import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { Injectable, NgZone } from '@angular/core';
import { AbstractRestService } from "../abstract-rest.service";
import { NewCommandModel } from "./new-command-model";
import { CommandDetails } from "./command-details";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommandsService extends AbstractRestService {

  constructor(private http: HttpClient, private zone: NgZone) {
    super();
  }

  public getCommandDetails(commandId: string): Observable<CommandDetails> {
    return this.http.get<CommandDetails>(this.getApiUrl(["commands", commandId]));
  }

  public addCommand(command: NewCommandModel) {
    return this.http.put<HttpStatusCode>(this.getApiUrl("commands"), command);
  }

  // public execute(commandId: string): Observable<string> {
  //   return this.http.get<string>(this.getApiUrl(["commands", commandId, "execute"]));
  // }

  public execute(commandId: string): Observable<string> {
    return Observable.create((observer: any) => {
      const eventSource = new EventSource(this.getApiUrl(["commands", commandId, "execute"]));
      
      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });
      };
    });
  }
}
