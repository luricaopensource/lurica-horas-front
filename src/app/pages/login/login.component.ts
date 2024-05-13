import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginService } from 'src/app/shared/services/login/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('triggerForm', { static: false })
  triggerForm: NgForm | null = null
  public form: FormGroup = new FormGroup({})

  constructor(
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm()
  }

  triggerSubmit() {
    if (!this.triggerForm) {
      console.warn('triggerForm not assigned a value')
    } else {
      if (this.triggerForm.valid) {
        this.triggerForm.ngSubmit.emit()
      }
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  isLoginPage(): boolean {
    return this.router.url.includes('login')
  }

  isRegisterPage(): boolean {
    return this.router.url.includes('register')
  }

  async login(): Promise<void> {
    if (this.form.invalid) return

    const formValue = this.form.value

    const username = formValue.username
    const password = formValue.password

    const response = await this.loginService.login(username, password)
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token)
      this.router.navigate(['/dashboard'])
    }
  }

  register(event: Event): void {
    return
  }
}
