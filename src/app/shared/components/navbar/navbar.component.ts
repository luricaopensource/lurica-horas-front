import { Component } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { User } from '../../models/users/user'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public user: User = {
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

  constructor(private breakpointObserver: BreakpointObserver) {
    this.user = {
      firstName: 'Julio',
      lastName: 'Dechert',
      username: 'jdechert',
      password: 'admin',
      email: 'julio.dechert@lurica.us',
      role: 'employee'
    }
  }

  isAdmin(): boolean {
    return this.user.role === 'admin'
  }
}
