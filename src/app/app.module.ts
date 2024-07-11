import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './pages/login/login.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { NavbarComponent } from './shared/components/navbar/navbar.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DialogComponent } from './shared/components/dialog/dialog.component'
import { MaterialModule } from './shared/material/material.module'
import { HttpConfigInterceptor } from './shared/services/HttpConfigInterceptor'
import { ModalModule } from './shared/components/modal/modal.module'
import { ProjectsComponent } from './pages/projects/projects.component'
import { UsersComponent } from './pages/users/users.component'
import { MilestonesComponent } from './pages/milestones/milestones.component'
import { ReportsComponent } from './pages/reports/reports.component'
import { ClientsComponent } from './pages/clients/clients.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    DialogComponent,
    ProjectsComponent,
    UsersComponent,
    ReportsComponent,
    ClientsComponent,
    MilestonesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ModalModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
