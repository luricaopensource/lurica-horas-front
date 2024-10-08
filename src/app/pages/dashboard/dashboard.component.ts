import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { DashboardItem } from './dashboard-datasource'
import { DashboardService } from 'src/app/shared/services/dashboard/dashboard.service'
import { TaskService } from 'src/app/shared/services/task/task.service'
import { IUser } from 'src/app/shared/models/users/user'
import { UserService } from 'src/app/shared/services/user/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ModalService } from 'src/app/shared/services/modal/modal.service'
import { IProject } from 'src/app/shared/models/projects/projects'
import { ProjectService } from 'src/app/shared/services/project/project.service'
import { IMilestone } from 'src/app/shared/models/milestones/milestones'
import { ITask } from 'src/app/shared/models/tasks/tasks'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public data: DashboardItem[] = []
  public filteredData: DashboardItem[] = []
  public user: IUser | null = null
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false
  public projects: IProject[] = []
  public milestones: IMilestone[] = []
  public selectedProject: IProject = {} as IProject
  public errorMessage: string = ''
  public isAdmin: boolean = false
  public taskToEdit: number | null = null
  public date: Date = new Date()
  public filteredEmployee: IUser = {} as IUser
  public employees: IUser[] = []
  public showEmployeeFilter: boolean = false
  public months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  public years: string[] = ['2024', '2025', '2026', '2027', '2028', '2029', '2030']

  constructor(private readonly dashboardService: DashboardService,
    private readonly taskService: TaskService,
    private userService: UserService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private modalService: ModalService
  ) {
  }

  ngOnInit(): void {
    this.getInitialData()
    this.user = this.userService.getUserFromLocalStorage()
    this.getEmployees()
    this.filteredEmployee = this.employees[0]
    this.isAdmin = this.userIsAdmin()
    this.buildForm()

    this.taskService.taskAdded.subscribe(() => {
      this.getInitialData()
    })

    document.addEventListener('click', this.handleClickOutside.bind(this))
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this))
  }

  async getEmployees(): Promise<void> {
    this.employees = await this.userService.getUsers()
  }

  getInitialData(): void {
    this.dashboardService.getDashboardData().then((data) => {
      data.forEach((item: DashboardItem) => {
        const date = new Date(item.date)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        item.date = `${day}/${month}/${date.getFullYear()}`
      })

      this.data = data
      this.filteredData = data
    })
  }

  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement

    // Close the dropdown only if the click was outside both the dropdown and the icon container
    if (!target.closest('.employee-filter-layer') && !target.closest('.toggle-icon')) {
      this.showEmployeeFilter = false
    }
  }

  applyEmployeeFilter(): void {
    if (this.filteredEmployee) {
      this.filteredData = this.data.filter(task => parseInt(task.employee.id) == this.filteredEmployee.id)
    }

    this.showEmployeeFilter = false
  }

  toggleEmployeeFilter(): void {
    this.showEmployeeFilter = !this.showEmployeeFilter
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      projectId: [null, [Validators.required]],
      milestoneId: [null, [Validators.required]],
      description: ['', [Validators.required]],
      type: [''],
      dateFrom: ['', [Validators.required]],
      hours: [null, [Validators.required]]
    })
  }

  public onProjectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const projectId = Number(selectElement.value)
    const selectedProject = this.projects.find(project => project.id === projectId)

    if (selectedProject) this.selectedProject = selectedProject
    this.milestones = selectedProject?.milestones || []
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  userIsAdmin(): boolean {
    return this.user?.roleName == "Administrador"
  }

  public async openEditTaskModal(taskId: number, modalTemplate: TemplateRef<any>): Promise<void> {
    this.resetForm()

    let currentTask = this.getTaskFromDashboard(taskId)

    this.taskToEdit = currentTask.id

    if (!this.user) return
    if (!this.user.id) return

    await this.setProjectsByUser()

    this.selectedProject = this.projects.find(project => project.id === currentTask.project.id) || {} as IProject

    const milestoneId = currentTask.milestone ? currentTask.milestone.id : 0

    console.log(currentTask.date)

    const [day, month, year] = currentTask.date.split('/')
    const taskDate = new Date(`${year}-${month}-${day}`)
    const formattedDate = taskDate.toISOString().split('T')[0]

    console.log(formattedDate)

    this.form.patchValue({
      projectId: currentTask.project.id,
      milestoneId: milestoneId,
      description: currentTask.description,
      dateFrom: formattedDate,
      hours: currentTask.hours
    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar tarea' })
  }

  async editTask(): Promise<void> {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { projectId, milestoneId, description, type, dateFrom, hours } = this.form.value

    if (!this.user) return

    const task: ITask = {
      id: this.taskToEdit!,
      projectId,
      milestoneId,
      description,
      date: "",
      hours,
      type,
      paid: false,
      status: 'Pendiente',
      userId: this.user.id!
    }

    try {
      await this.taskService.editTask(task)
      this.modalService.close()
      this.resetForm()
    } catch (error) {
      console.error(error)
    }

    this.resetForm()
    this.reloadTasks()
  }

  public deleteTask(id: number, index: number): void {
    this.taskService.deleteTask(id)
    this.data.splice(index, 1)
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  private resetForm(): void {
    this.form.reset()
    this.formSubmitted = false
  }

  private getTaskFromDashboard(id: number): DashboardItem {
    return this.data.find(task => task.id === id)!
  }

  private async setProjectsByUser(): Promise<void> {
    this.projects = await this.projectService.getProjects()
  }

  private reloadTasks(): void {
    this.data = []
    this.getInitialData()
  }
}
