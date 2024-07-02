import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { getCurrencyId } from 'src/app/shared/helpers/currency'
import { getRoleId } from 'src/app/shared/helpers/role'
import { INewUser, IUser } from 'src/app/shared/models/users/user'
import { LoginService } from 'src/app/shared/services/login/login.service'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { UserService } from 'src/app/shared/services/user/user.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  public form: FormGroup = new FormGroup({})
  public users: IUser[] = []
  public formSubmitted: boolean = false
  public showPasswordField: boolean = true

  constructor(private modalService: ModalService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private userService: UserService
  ) {
    this.buildForm()
    this.getUsers()
  }

  private async getUsers(): Promise<void> {
    const users = await this.userService.getUsers()

    this.users = users
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(this.loginService.getPasswordMinLength())]],
      password: ['', [Validators.required, Validators.minLength(this.loginService.getUsernameMinLength())]],
      email: ['', [Validators.required, Validators.email]],
      currency: ['', [Validators.required]],
      role: ['', [Validators.required]],
      hourlyAmount: ['', [Validators.required]],
      monthlyAmount: ['', [Validators.required]]
    })
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  public createUser(modalTemplate: TemplateRef<any>): void {
    this.openModal(modalTemplate, { size: 'lg', title: 'Crear usuario' })
  }

  public async register() {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { firstName, lastName, username, password, email, currency, role, hourlyAmount, monthlyAmount } = this.form.value

    const user: INewUser = {
      firstName,
      lastName,
      username,
      password,
      email,
      currency: parseInt(currency),
      role: parseInt(role),
      hourlyAmount,
      monthlyAmount
    }

    const response = await this.userService.createUser(user)
    if (response.id) {
      this.getUsers()
      this.modalService.close()
      this.resetForm()
    }
  }

  public async editUser(userId: number, modalTemplate: TemplateRef<any>): Promise<void> {
    this.resetForm()

    this.showPasswordField = false
    const user = this.users.find(user => user.id === userId)

    if (!user) return

    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      currency: getCurrencyId(user.currency?.toLowerCase() || ''),
      role: getRoleId(user.role?.toLowerCase() || ''),
      hourlyAmount: user.hourlyAmount,
      monthlyAmount: user.monthlyAmount
    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar usuario' })
  }

  public async deleteUser(userId: number): Promise<void> {
    const response = await this.userService.deleteUser(userId)

    if (response.id) { this.getUsers() }
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  private resetForm(): void {
    this.form.reset()
    this.formSubmitted = false
  }
}
