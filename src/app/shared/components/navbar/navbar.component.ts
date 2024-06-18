import { Component, TemplateRef } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { IUser } from '../../models/users/user'
import { LoginService } from '../../services/login/login.service'
import { ModalService } from '../../services/modal/modal.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public user: IUser = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    role: ''
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private authService: LoginService,
    private modalService: ModalService
  ) {
    //obtener usuario despues de hacer login, guardarlo en localstorage y obtenerlo de ahi
    this.user = { 
      firstName: 'Julio',
      lastName: 'Dechert',
      username: 'jdechert',
      password: 'admin',
      email: 'julio.dechert@lurica.us',
      role: 'admin'
    }
  }

  public openModal(modalTemplate: TemplateRef<any>, title: string) {
    this.modalService
      .open(modalTemplate, { size: 'lg', title })
      .subscribe()
  }

  isAdmin(): boolean {
    return this.user.role === 'admin'
  }

  logout() {
    this.authService.logout()
  }
}
