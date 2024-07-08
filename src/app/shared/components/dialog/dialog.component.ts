import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewChildren, ViewContainerRef, TemplateRef } from '@angular/core'
import { TaskService } from '../../services/task/task.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ITask } from '../../models/tasks/tasks'
import { ModalComponent } from '../modal/modal.component'
import { ModalService } from '../../services/modal/modal.service'
import { ProjectService } from 'src/app/shared/services/project/project.service'
import { IProject } from 'src/app/shared/models/projects/projects'
import { MilestoneService } from '../../services/milestones/milestones.service'
import { IMilestone } from '../../models/milestones/milestones'


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

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private projectService: ProjectService,
    private milestoneService: MilestoneService
  ) { }

  // ngOnInit(): void {
  //   this.buildForm()
  // }

  private async getProjects(): Promise<void> {
    this.projects = await this.projectService.getProjects()
  }

  private async getMilestones(): Promise<void> {
    this.milestones = await this.milestoneService.getMilestones()
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      project: ['', [Validators.required]],
      milestone: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]]
    })
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

  public async createTask(): Promise<void> {
    if (this.form.invalid) {
      this.formSubmitted = true
      return
    }

    const { project, description, dateFrom, dateTo } = this.form.value
    const from = new Date(dateFrom)
    const to = new Date(dateTo)

    if (from > to) return // FIXME: Show error in form

    const hours = this.getHours(from, to)

    const task: ITask = {
      project,
      description,
      dateFrom: this.formatDate(dateFrom),
      dateTo: this.formatDate(dateTo),
      hours,
      paid: false,
      status: 'Pendiente',
      userId: 1 // FIXME: Change this to use the authService function to get the current user from localstorage
    }

    const response = await this.taskService.createTask(task)
    if (response.taskId) this.taskService.taskAdded.next(true)
    this.modalService.close()
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

  private formatDate(date: Date): string {
    return ("0" + date.getDate()).slice(-2)
      + "-" + ("0" + (date.getMonth() + 1)).slice(-2)
      + "-" + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)
  }

  private resetForm(): void {
    this.form.reset()
    this.formSubmitted = false
  }
}
