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
  public selectedProject: IProject = {} as IProject
  public errorMessage: string = ''
  public isAdmin: boolean = false

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

    this.form.patchValue({})

    this.openModal(modalTemplate, { size: 'lg', title: 'Editar tarea' })
  }

  public editTask(): void { }

  public deleteTask(id: number): void {
    this.taskService.deleteTask(id)
    this.dataSource.data.splice(id - 1, 1)
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
}
