import { Component, OnInit, TemplateRef } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { IUser } from '../../models/users/user'
import { LoginService } from '../../services/login/login.service'
import { ModalService } from '../../services/modal/modal.service'
import { UserService } from '../../services/user/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

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
    email: '',
    role: '',
    currency: '',
    hourlyAmount: 0,
    monthlyAmount: 0
  }

  public form: FormGroup = new FormGroup({})

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private breakpointObserver: BreakpointObserver,
    private authService: LoginService,
    private modalService: ModalService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm()
    this.getCurrentUser()
  }

  private buildForm(): void {
    const passwordInputValidations = ['', [Validators.required, Validators.minLength(this.authService.getUsernameMinLength())]]

    this.form = this.formBuilder.group({
      password: passwordInputValidations,
      confirmPassword: passwordInputValidations
    })
  }

  private getCurrentUser(): void {
    const user = this.userService.getUserFromLocalStorage()

    if (!user) {
      this.logout()
      return
    }

    this.user = user
  }

  public openModal(modalTemplate: TemplateRef<any>, title: string) {
    this.modalService
      .open(modalTemplate, { size: 'lg', title })
      .subscribe()
  }

  isAdmin(): boolean {
    return this.user.role === 'Administrador'
  }

  logout() {
    this.authService.logout()
  }

  async saveUserPassword(): Promise<void> {
    const { password, confirmPassword } = this.form.value

    console.log(password, confirmPassword)

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    this.modalService.close()

    this.logout()
  }
}
