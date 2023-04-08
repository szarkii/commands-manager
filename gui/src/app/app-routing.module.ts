import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandDetailsComponent } from './command/command-details/command-details.component';
import { HomeComponent } from './home/home.component';
import { NewCommandComponent } from './command/new-command/new-command.component';
import { GroupDetailsComponent } from './groups/group-details/group-details.component';

const routes: Routes = [
  {
    "path": "",
    "component": HomeComponent
  },
  {
    "path": "commands/:id",
    "component": CommandDetailsComponent
  },
  {
    "path": "groups/:id",
    "component": GroupDetailsComponent
  },
  {
    "path": "groups/:id/commands/new",
    "component": NewCommandComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
