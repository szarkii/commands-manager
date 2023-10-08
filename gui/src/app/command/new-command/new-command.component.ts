import { Component } from '@angular/core';
import { NewCommandModel } from '../new-command-model';
import { Observable, map, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommandsService } from '../commands-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-command',
  templateUrl: './new-command.component.html',
  styleUrls: ['./new-command.component.css']
})
export class NewCommandComponent {
  public newCommandModel: NewCommandModel = {} as NewCommandModel;

  constructor(private route: ActivatedRoute, private commandsService: CommandsService, private messageService: MessageService) {
    this.route.paramMap.pipe(
      take(1),
      map(params => params.get("id") as string),
    ).subscribe(id => this.newCommandModel.groupId = id);
  }

  public addNewCommand() {
    this.commandsService.addCommand(this.newCommandModel).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Success", detail: `Command "${this.newCommandModel.name}" added.` });
      }, error: (error) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: error.error });
      }
    });
  }
}
