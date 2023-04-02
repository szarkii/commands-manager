import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TreeModule } from 'primeng/tree';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommandDetailsComponent } from './command/command-details/command-details.component';
import { NewCommandComponent } from './command/new-command/new-command.component';
import { GroupDetailsComponent } from './groups/group-details/group-details.component';
import { GroupsListComponent } from './groups/groups-list/groups-list.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupsListComponent,
    CommandDetailsComponent,
    HomeComponent,
    NewCommandComponent,
    GroupDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TreeModule,
    PanelModule,
    ButtonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
