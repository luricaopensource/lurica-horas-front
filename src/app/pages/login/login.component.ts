import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/shared/models/users/user'
import { LoginService } from 'src/app/shared/services/login/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    const user = new User(
      "Julio",
      "Dechert",
      "juliodechert",
      "admin",
      "julio.dechert@lurica.us",
      "admin"
    )

    this.loginService.register(user)
  }

  login() {

  }
}
