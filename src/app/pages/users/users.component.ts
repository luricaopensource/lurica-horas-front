import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { currencies, getCurrencyId } from 'src/app/shared/helpers/currency'
import { getRoleId, roles } from 'src/app/shared/helpers/role'
import { IUser } from 'src/app/shared/models/users/user'
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
  public userToEdit: IUser | null = null
  public isEditModal: boolean = false
  public currencies = currencies
  public roles = roles

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
      password: ['', [Validators.minLength(this.loginService.getUsernameMinLength())]],
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

    const user: IUser = {
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

  public openEditUserModal(userId: number, modalTemplate: TemplateRef<any>): void {
    this.resetForm()

    this.isEditModal = true
    this.showPasswordField = false
    const user = this.users.find(user => user.id === userId)

    if (!user) return

    this.userToEdit = user

    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      currency: getCurrencyId(user.currencyName || ""),
      role: getRoleId(user.roleName || ""),
      hourlyAmount: user.hourlyAmount,
      monthlyAmount: user.monthlyAmount
    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar usuario' })
  }

  public async editUser(): Promise<void> {
    if (!this.userToEdit) return

    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { firstName, lastName, username, email, currency, role, hourlyAmount, monthlyAmount } = this.form.value

    const user: IUser = {
      id: this.userToEdit.id,
      firstName,
      lastName,
      username,
      email,
      currency: parseInt(currency),
      role: parseInt(role),
      hourlyAmount,
      monthlyAmount
    }

    try {
      const response = await this.userService.updateUser(user)

      if (response.id) {
        this.getUsers()
        this.modalService.close()
        this.resetForm()
      }
    } catch (error) {
      console.log(error)
    }
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
