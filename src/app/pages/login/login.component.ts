import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { User } from 'src/app/shared/models/users/user'
import { LoginService } from 'src/app/shared/services/login/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = new FormGroup({})
  constructor(private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm()
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  isLoginPage(): boolean {
    return this.router.url.includes('login')
  }

  isRegisterPage(): boolean {
    return this.router.url.includes('register')
  }

  login(event: Event): void {
    event.preventDefault()
    if (this.form.invalid) return

    const formValue = this.form.value

    const username = formValue.username
    const password = formValue.password

    const response = this.loginService.login(username, password)
    console.log(response)
  }

  register(event: Event): void {
    return
  }
}
