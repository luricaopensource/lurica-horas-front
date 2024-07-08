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
    roleName: '',
    currencyName: '',
    hourlyAmount: 0,
    monthlyAmount: 0
  }

  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false
  public emptyPassword: boolean = true

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
    this.form.reset()

    this.modalService
      .open(modalTemplate, { size: 'lg', title })
      .subscribe()
  }

  isAdmin(): boolean {
    return this.user.roleName === 'Administrador'
  }

  logout() {
    this.authService.logout()
  }

  async saveUserPassword(): Promise<void> {
    this.formSubmitted = true
    const { password, confirmPassword } = this.form.value

    if (!password) {
      this.emptyPassword = true
      return
    }

    if (password !== confirmPassword) {
      // TODO: Show error message in the modal
      alert('Las contraseñas no coinciden')
      return
    }

    this.emptyPassword = false

    const user = this.userService.getUserFromLocalStorage()

    if (!user) {
      // TODO: Show error message in the modal
      console.error("Error al obtener el usuario de LocalStorage")
      return
    }

    const updatedUser: IUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password,
      email: user.email
    }

    try {
      await this.userService.updateUser(updatedUser)

      // TODO: Show success message in the modal

      this.modalService.close()
      this.formSubmitted = false
      this.emptyPassword = true
      this.logout()
    } catch (error) {
      // TODO: Show error message in the modal
    }
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }
}
