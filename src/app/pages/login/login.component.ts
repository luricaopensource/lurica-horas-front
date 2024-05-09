import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/users/user'
import { LoginService } from 'src/app/shared/services/login/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void { }

  isLoginPage(): boolean {
    return this.router.url.includes('login');
  }

  isRegisterPage(): boolean {
    return this.router.url.includes('register');
  }

  login() {}
  register() {}

}
