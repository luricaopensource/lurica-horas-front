import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
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
import { MilestoneService } from 'src/app/shared/services/milestones/milestones.service'
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
    private milestoneService: MilestoneService,
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
        const date = new Date(item.dateTo)
        item.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
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
      dateFrom: [new Date(), [Validators.required]],
      dateTo: [new Date(), [Validators.required]]
    })
  }

  public onProjectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const projectId = Number(selectElement.value)
    const selectedProject = this.projects.find(project => project.id === projectId)

    if (selectedProject) this.selectedProject = selectedProject
    this.setMilestonesByProject(projectId);
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  userIsAdmin(): boolean {
    return this.user?.roleName == "Administrador"
  }

  public openEditTaskModal(taskId: number, modalTemplate: TemplateRef<any>): void {
    this.resetForm()

    let currentTask = this.getTaskFromDashboard(taskId)

    this.taskToEdit = currentTask.id

    this.setProjectsByUser(this.user!.id!);

    console.log(currentTask)

    this.form.patchValue({
      projectId: currentTask.project.id,
      milestoneId: currentTask.milestone.id,
      description: currentTask.description,
      dateFrom: new Date(currentTask.date),
      dateTo: new Date(currentTask.dateTo),

    })

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar tarea' })

  }

  async editTask(): Promise<void> { 
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { projectId, milestoneId, description, type, dateFrom, dateTo } = this.form.value
    const from = new Date(dateFrom)
    const to = new Date(dateTo)

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return
    }

    if (from > to) {
      this.errorMessage = 'Fecha desde no puede ser mayor a fecha hasta'
      return
    }

    const hours = this.getHours(from, to)

    if (hours === 0) {
      this.errorMessage = 'Fecha desde no puede ser igual a fecha hasta'
      return
    }

    if (!this.user) return

    const task: ITask = {
      id: this.taskToEdit!,
      projectId,
      milestoneId,
      description,
      dateFrom: from.toLocaleString(),
      dateTo: to.toLocaleString(),
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

  private setProjectsByUser(userId: number): void {
    this.projectService.getProjectsByEmployee(userId).then((projects) => {
      this.projects = projects
    })
  }

  private setMilestonesByProject(projectId: number): void {
    this.milestoneService.getMilestonesByProject(projectId).then((milestones) => {
      this.milestones = milestones
    })
  }

  private reloadTasks(): void {
    this.dataSource.data = []
    this.getInitialData()
  }

  private getHours(dateFrom: Date, dateTo: Date): number {
    let diff = (dateFrom.getTime() - dateTo.getTime()) / 1000
    diff /= (60 * 60)
    return Math.abs(Math.round(diff))
  }

}
