import { Component, ViewChild, TemplateRef } from '@angular/core'
import { TaskService } from '../../services/task/task.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ITask } from '../../models/tasks/tasks'
import { ModalService } from '../../services/modal/modal.service'
import { ProjectService } from 'src/app/shared/services/project/project.service'
import { IProject } from 'src/app/shared/models/projects/projects'
import { IMilestone } from '../../models/milestones/milestones'
import { UserService } from '../../services/user/user.service'
import { IUser } from '../../models/users/user'


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  public projects: IProject[] = []
  public milestones: IMilestone[] = []
  public form: FormGroup = new FormGroup({})
  public formStatus: boolean = false
  public formSubmitted: boolean = false
  public tasks: ITask[] = [];
  public editIndex: number | null = null;
  public user: IUser | null = null
  public errorMessage: string = ''

  @ViewChild('viewTasksModal') viewTasksModal!: TemplateRef<any>

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private projectService: ProjectService,
    private userService: UserService
  ) {
    this.buildForm()
    this.getProjects()
    this.user = this.userService.getUserFromLocalStorage()
  }

  private async getProjects(): Promise<void> {
    this.projects = this.userIsAdmin() ? await this.projectService.getProjects() : await this.projectService.getProjectsByEmployee(this.user?.id!)
  }

  private userIsAdmin(): boolean {
    return this.user?.role == 1
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      projectId: ['', [Validators.required]],
      milestoneId: [''],
      description: ['', [Validators.required]],
      type: [''],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]]
    })
  }

  selectType(type: string): void {
    this.form.patchValue({ type })
    document.querySelectorAll('.tag').forEach(tag => {
      tag.classList.remove('selected')
    })
    document.querySelector(`.tag.${type.toLowerCase()}`)?.classList.add('selected')
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string, title: string }) {
    this.modalService
      .open(modalTemplate, options)
      .subscribe()
  }

  public openNewProjectModal(modalTemplate: TemplateRef<any>): void {
    this.openModal(modalTemplate, { size: 'lg', title: 'Crear tarea' })
    this.resetForm()
  }

  public createTask(): void {
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
      projectId,
      milestoneId,
      description,
      dateFrom: new Date(dateFrom).toLocaleString(),
      dateTo: new Date(dateTo).toLocaleString(),
      hours,
      type,
      paid: false,
      status: 'Pendiente',
      userId: this.user.id!
    }

    if (this.editIndex !== null) {
      this.tasks[this.editIndex] = task
      this.editIndex = null
    } else {
      this.tasks.push(task)
    }

    this.resetForm()
  }

  public editTask(index: number): void {
    const task = this.tasks[index]
    const selectedProject = this.projects.find(project => project.id === task.projectId)
    this.milestones = selectedProject?.milestones!

    const dateFrom = new Date(task.dateFrom)
    const dateTo = new Date(task.dateTo)

    this.form.patchValue({
      projectId: task.projectId,
      milestoneId: task.milestoneId,
      description: task.description,
      type: task.type,
      dateFrom: dateFrom,
      dateTo: dateTo
    })
    this.editIndex = index
  }

  public deleteTask(index: number): void {
    this.tasks.splice(index, 1)
  }

  public async sendTasks(): Promise<void> {
    if (this.tasks.length === 0) return

    try {
      await this.taskService.createTasks(this.tasks)
      this.taskService.taskAdded.next(true)
      this.modalService.close()
    } catch (error) {
      console.error(error)
    }
  }

  public onProjectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const projectId = Number(selectElement.value)
    const selectedProject = this.projects.find(project => project.id === projectId)

    if (selectedProject) {
      this.milestones = selectedProject.milestones
    }
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  private getHours(dateFrom: Date, dateTo: Date): number {
    let diff = (dateFrom.getTime() - dateTo.getTime()) / 1000
    diff /= (60 * 60)
    return Math.abs(Math.round(diff))
  }

  private resetForm(): void {
    this.errorMessage = ''
    this.form.reset()
    this.formSubmitted = false
    this.milestones = []
  }
}
