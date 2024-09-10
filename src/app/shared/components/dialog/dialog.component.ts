import { Component, ViewChild, TemplateRef, OnInit } from "@angular/core"
import { TaskService } from "../../services/task/task.service"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ITask } from "../../models/tasks/tasks"
import { ModalService } from "../../services/modal/modal.service"
import { ProjectService } from "src/app/shared/services/project/project.service"
import { IProject } from "src/app/shared/models/projects/projects"
import { IMilestone } from "../../models/milestones/milestones"
import { UserService } from "../../services/user/user.service"
import { IUser } from "../../models/users/user"
import { DateFormatter } from "../../helpers/date-formatter"

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"],
})
export class DialogComponent implements OnInit {
  public projects: IProject[] = []
  public milestones: IMilestone[] = []
  public form: FormGroup = new FormGroup({})
  public formStatus: boolean = false
  public formSubmitted: boolean = false
  public tasks: ITask[] = []
  public editIndex: number = 0
  public editMode: boolean = false
  public user: IUser | null = null
  public errorMessage: string = ""

  @ViewChild("viewTasksModal") viewTasksModal!: TemplateRef<any>

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private projectService: ProjectService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserFromLocalStorage()
    this.buildForm()
    this.getProjects()
  }

  private async getProjects(): Promise<void> {
    this.projects = this.userIsAdmin() ? await this.projectService.getProjects() : await this.projectService.getProjectsByEmployee(this.user?.id!)
  }

  private userIsAdmin(): boolean {
    return this.user?.role == 1
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      projectId: ["", [Validators.required]],
      milestoneId: [""],
      description: ["", [Validators.required]],
      type: [""],
      date: [null, [Validators.required]],
      hours: [null, [Validators.required]]
    })
  }

  selectType(type: string): void {
    console.log('Develop type selection logic')
  }

  private openModal(modalTemplate: TemplateRef<any>, options: { size: string; title: string }) {
    this.modalService.open(modalTemplate, options).subscribe()
  }

  public openNewProjectModal(modalTemplate: TemplateRef<any>): void {
    this.openModal(modalTemplate, { size: "lg", title: "Crear tarea" })
    this.resetForm()
  }

  public addTaskToQueue(): void {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { projectId, milestoneId, description, type, date, hours } = this.form.value
    if (!this.user) return

    console.log(date)

    const task: ITask = {
      projectId,
      milestoneId,
      description,
      dateFrom: DateFormatter.getDDMMYYYY(date),
      hours,
      type,
      paid: false,
      status: "Pendiente",
      userId: this.user.id!,
    }

    console.log(task)

    if (!this.editMode) {
      this.tasks.push(task)
    } else {
      this.tasks[this.editIndex] = task
      this.editMode = false
    }

    this.resetForm()
  }

  public editTask(index: number): void {
    this.editMode = true
    this.editIndex = index
    const task = this.tasks[index]
    const selectedProject = this.projects.find((project) => project.id == task.projectId)
    this.milestones = selectedProject?.milestones!

    const taskDate = new Date(task.dateFrom)
    const formattedDate = taskDate.toISOString().split('T')[0]

    this.form.patchValue({
      projectId: task.projectId,
      milestoneId: task.milestoneId,
      description: task.description,
      type: task.type,
      date: formattedDate,
      hours: task.hours
    })
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
    const selectedProject = this.projects.find((project) => project.id === projectId)

    if (selectedProject) {
      this.milestones = selectedProject.milestones
    }
  }

  public isInvalidInput(inputName: string): boolean {
    const input = this.form.get(inputName)

    if (!input) return false

    return input.invalid && (input.dirty || input.touched || this.formSubmitted)
  }

  private resetForm(): void {
    this.errorMessage = ""
    this.form.reset()
    this.formSubmitted = false
  }
}
