import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommandsService } from '../commands-service';
import { CommandBasicInfo } from '../command-basic-info';
import { Observable, map, switchMap } from 'rxjs';
import { CommandDetails } from '../command-details';

@Component({
  selector: 'app-command-details',
  templateUrl: './command-details.component.html',
  styleUrls: ['./command-details.component.css']
})
export class CommandDetailsComponent {
  public command$: Observable<CommandDetails>;
  public editable = false;

  constructor(private route: ActivatedRoute, private commandsService: CommandsService) {
    this.command$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get("id") as string),
      switchMap((commandId: string) => this.commandsService.getCommandDetails(commandId))
    );
  }

  public toggleEditable() {
    this.editable = !this.editable;
  }
}
