import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { currencies, getCurrencyId } from 'src/app/shared/helpers/currency'
import { getRoleId, roles } from 'src/app/shared/helpers/role'
import { IProject } from 'src/app/shared/models/projects/projects'
import { IUser, IUsersToProjects } from 'src/app/shared/models/users/user'
import { LoginService } from 'src/app/shared/services/login/login.service'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { ProjectService } from 'src/app/shared/services/project/project.service'
import { UserService } from 'src/app/shared/services/user/user.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public form: FormGroup = new FormGroup({})
  public users: IUser[] = []
  public formSubmitted: boolean = false
  public showPasswordField: boolean = true
  public userToEdit: IUser | null = null
  public isEditModal: boolean = false
  public currencies = currencies
  public roles = roles
  public projects: IProject[] = []
  public selectedProject: IProject = {} as IProject
  public selectedProjects: IProject[] = []

  constructor(private modalService: ModalService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private service: UserService,
    private projectService: ProjectService,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.buildForm()
    this.getUsers()
    this.getProjects()
  }

  private async getUsers(): Promise<void> {
    const users = await this.service.getUsers()

    this.users = users
    this.changeDetector.detectChanges()
  }

  private async getProjects(): Promise<void> {
    const projects = await this.projectService.getProjects()

    this.projects = projects
    this.changeDetector.detectChanges()
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(this.loginService.getUsernameMinLength())]],
      password: ['', [Validators.minLength(this.loginService.getPasswordMinLength())]],
      email: ['', [Validators.required, Validators.email]],
      currency: ['', [Validators.required]],
      role: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      amountType: ['', [Validators.required]],
      projects: ['']
    })
  }

  sameAmountType(amountType: number): boolean {
    return this.userToEdit?.amountType == amountType
  }

  addProject(): void {
    const selectedProject = this.form.get('projects')?.value

    if (selectedProject && !this.selectedProjects.some(project => project.id === selectedProject.id)) {
      this.projects = this.projects.filter(project => project.id !== selectedProject.id)

      this.selectedProjects.push(selectedProject)

      this.form.get('projects')?.reset()
    }
  }

  async removeProject(index: number): Promise<void> {
    const projectRemoved = this.selectedProjects.splice(index, 1)
    this.projects.push(projectRemoved[0])

    const userToProject = this.userToEdit?.projects?.find(project => project.id === projectRemoved[0].id)

    if (!userToProject) return

    try {
      await this.service.deleteUserToProject(this.userToEdit?.id!, projectRemoved[0].id!)
      this.userToEdit!.projects?.splice(this.userToEdit!.projects?.findIndex(project => project.id === projectRemoved[0].id), 1)
    }
    catch (error) {
      console.log(error)
    }
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  public closeModal(): void {
    this.resetForm()
    this.modalService.close()
    this.changeDetector.detectChanges()
  }

  public openCreateUserModal(modalTemplate: TemplateRef<any>): void {
    this.getProjects()
    this.selectedProjects = []
    this.resetForm()
    this.isEditModal = false
    this.showPasswordField = true
    this.openModal(modalTemplate, { size: 'md', title: 'Crear usuario' })
  }

  public async register() {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }
    const { firstName, lastName, username, password, email, currency, role, amount, amountType } = this.form.value

    const user: IUser = {
      firstName,
      lastName,
      username,
      password,
      email,
      currency: parseInt(currency),
      role: parseInt(role),
      amount,
      amountType,
      userToProjects: []
    }

    try {
      const response = await this.service.createUser(user)
      if (response.id) {
        user.id = response.id
        for (let selectedProject of this.selectedProjects) {
          if (!selectedProject.id) continue

          const userToProject: IUsersToProjects = {
            user: user.id,
            project: selectedProject.id
          }

          user.userToProjects?.push(userToProject)
        }
        await this.service.updateUser(user)
        this.getUsers()
        this.closeModal()
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async openEditUserModal(userId: number, modalTemplate: TemplateRef<any>): Promise<void> {
    this.projects = await this.projectService.getProjects()

    this.isEditModal = true
    this.form.get('password')?.clearValidators()
    this.form.get('password')?.updateValueAndValidity()
    this.showPasswordField = false
    const user = this.users.find(user => user.id === userId)

    if (!user) return

    this.userToEdit = user

    this.selectedProjects = this.userToEdit.projects?.map((selectedProject) => {
      const project = this.projects.find(project => project.id == selectedProject.id)
      if (project) {
        this.projects.splice(this.projects.findIndex(project => project.id == selectedProject.id), 1)
        return project
      }
      return {} as IProject
    }) || []

    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      currency: getCurrencyId(user.currencyName || ""),
      role: getRoleId(user.roleName || ""),
      amount: user.amount,
      amountType: user.amountType?.toString(),
      projects: ''
    })
    this.changeDetector.detectChanges()

    this.openModal(modalTemplate, { size: 'md', title: 'Editar usuario' })
  }

  public async editUser(): Promise<void> {
    if (!this.userToEdit) return

    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { firstName, lastName, username, email, currency, role, amount, amountType } = this.form.value

    this.userToEdit.userToProjects = []

    for (let selectedProject of this.selectedProjects) {
      if (!selectedProject.id) continue

      const userToProject: IUsersToProjects = {
        user: this.userToEdit.id!,
        project: selectedProject.id
      }

      this.userToEdit.userToProjects?.push(userToProject)
    }

    const user: IUser = {
      id: this.userToEdit.id,
      firstName,
      lastName,
      username,
      email,
      currency: parseInt(currency),
      role: parseInt(role),
      amount,
      amountType,
      userToProjects: this.userToEdit.userToProjects
    }

    try {
      const response = await this.service.updateUser(user)

      if (response.id) {
        this.getUsers()
        this.closeModal()
        this.resetForm()
      }
    } catch (error) {
      // TODO: Handle error properly
      console.log(error)
    }
  }

  public async deleteUser(userId: number): Promise<void> {
    const response = await this.service.deleteUser(userId)

    if (response.id) { this.getUsers() }
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  private resetForm(): void {
    this.form.reset()
    this.form.markAsPristine()
    this.form.markAsUntouched()
    this.formSubmitted = false
  }
}
