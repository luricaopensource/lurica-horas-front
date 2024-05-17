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



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
