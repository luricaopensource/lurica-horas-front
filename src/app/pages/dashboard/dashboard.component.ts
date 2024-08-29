import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatTable } from '@angular/material/table'
import { DashboardDataSource, DashboardItem } from './dashboard-datasource'
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
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatTable) table!: MatTable<DashboardItem>
  dataSource: DashboardDataSource
  data: DashboardItem[] = []
  user: IUser | null = null
  public form: FormGroup = new FormGroup({})
  public formSubmitted: boolean = false
  public projects: IProject[] = []
  public milestones: IMilestone[] = []
  public selectedProject: IProject = {} as IProject
  public errorMessage: string = ''
  public isAdmin: boolean = false
  public taskToEdit: number | null = null
  public date: Date = new Date()

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'date',
    'project',
    'description',
    'hours',
    'status',
    'hourly-amount',
    'currency',
    'usd-amount',
    'cost-amount'
  ];

  constructor(private readonly dashboardService: DashboardService,
    private readonly taskService: TaskService,
    private userService: UserService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private modalService: ModalService
  ) {
    this.dataSource = new DashboardDataSource(this.dashboardService)
    this.user = this.userService.getUserFromLocalStorage()
    this.isAdmin = this.userIsAdmin()
    this.buildForm()
  }

  getInitialData(): void {
    this.dashboardService.getDashboardData().then((data) => {
      data.forEach((item: DashboardItem) => {
        const date = new Date(item.createdAt)
        item.createdAt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      })

      this.dataSource.data = data
    })
  }

  ngOnInit(): void {
    this.taskService.taskAdded.subscribe(() => {
      this.getInitialData()
    })
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

    await this.setProjectsByUser(this.user.id)

    this.selectedProject = this.projects.find(project => project.id === currentTask.project.id) || {} as IProject

    const milestoneId = currentTask.milestone ? currentTask.milestone.id : 0

    this.form.patchValue({
      projectId: currentTask.project.id,
      milestoneId: milestoneId,
      description: currentTask.description,
      dateFrom: new Date(currentTask.createdAt),
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
    const from = new Date(dateFrom)

    if (!this.user) return

    const task: ITask = {
      id: this.taskToEdit!,
      projectId,
      milestoneId,
      description,
      dateFrom: from.toLocaleString(),
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
    this.dataSource.data.splice(index, 1)
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
    return this.dataSource.data.find(task => task.id === id)!
  }

  private async setProjectsByUser(userId: number): Promise<void> {
    this.projects = await this.projectService.getProjectsByEmployee(userId)
  }

  private reloadTasks(): void {
    this.dataSource.data = []
    this.getInitialData()
  }
}
