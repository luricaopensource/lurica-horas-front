import { Component, OnInit, ViewChild } from "@angular/core"
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms"
import { ErrorStateMatcher } from "@angular/material/core"
import { Router } from "@angular/router"
import { DEFAULT_ROLE_ID } from "src/app/shared/helpers/role"
import { IUser } from "src/app/shared/models/users/user"
import { LoginService } from "src/app/shared/services/login/login.service"
import { UserService } from "src/app/shared/services/user/user.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild("triggerForm", { static: false }) triggerForm: NgForm | null = null;
  public form: FormGroup = new FormGroup({});
  public errorMatcher: ErrorStateMatcher
  public isLoginPage: boolean = true;
  private PASSWORD_MIN_LENGTH = 6;
  private USERNAME_MIN_LENGTH = 5;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.errorMatcher = new ErrorStateMatcher()
  }

  ngOnInit(): void {
    this.isLoginPage = this.router.url.includes("login")

    if (this.isLoginPage) this.buildForm()
    else this.buildRegisterForm()
  }

  triggerSubmit() {
    if (!this.triggerForm) {
      console.warn("triggerForm not assigned a value")
    } else {
      if (this.triggerForm.valid) {
        this.triggerForm.ngSubmit.emit()
      }
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(this.USERNAME_MIN_LENGTH)],],
      password: ["", [Validators.required, Validators.minLength(this.PASSWORD_MIN_LENGTH)]]
    })
  }

  private buildRegisterForm(): void {
    this.form = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      username: ["", [Validators.required, Validators.minLength(this.USERNAME_MIN_LENGTH)]],
      password: ["", [Validators.required, Validators.minLength(this.PASSWORD_MIN_LENGTH)]],
      email: ["", [Validators.required, Validators.email]],
    })
  }

  async login(): Promise<void> {
    if (this.form.invalid) return

    const formValue = this.form.value

    const username = formValue.username
    const password = formValue.password

    const response = await this.loginService.login(username, password)
    if (response.access_token) {
      localStorage.setItem("access_token", response.access_token)

      const user: IUser = await this.userService.getCurrentUser()
      localStorage.setItem('user', JSON.stringify(user))

      this.router.navigate(["/dashboard"])
    }
  }

  async register(): Promise<void> {
    if (this.form.invalid) return

    const formValue = this.form.value

    const user: IUser = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      username: formValue.username,
      password: formValue.password,
      email: formValue.email,
      role: DEFAULT_ROLE_ID,
    }

    const response = await this.loginService.register(user)
    if (response.id) this.router.navigate(["/login"])
  }
}
