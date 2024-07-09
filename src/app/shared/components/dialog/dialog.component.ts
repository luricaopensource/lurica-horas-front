import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewChildren, ViewContainerRef, TemplateRef } from '@angular/core'
import { TaskService } from '../../services/task/task.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ITask } from '../../models/tasks/tasks'
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
export class DialogComponent{
  public projects: IProject[] = []
  public milestones: IMilestone[] = []
  public form: FormGroup = new FormGroup({})
  public formStatus: boolean = false
  public formSubmitted: boolean = false
  public tasks: ITask[] = [];

  @ViewChild('viewTasksModal') viewTasksModal!: TemplateRef<any>;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private projectService: ProjectService,
    private milestoneService: MilestoneService
  ) {
    this.buildForm()
    this.getProjects()
    this.getMilestones()
   }

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
      type: ['', [Validators.required]],
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

  public createTask(): void {
    if (this.form.invalid) {
      this.formSubmitted = true;
      return;
    }
  
    const { project, description, type, dateFrom, dateTo } = this.form.value;
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
  
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return;
    }
  
    if (from > to) return; // FIXME: Show error in form
  
    const hours = this.getHours(from, to);
  
    const task: ITask = {
      project,
      description,
      dateFrom: this.formatDate(dateFrom),
      dateTo: this.formatDate(dateTo),
      hours,
      type,
      paid: false,
      status: 'Pendiente',
      userId: 1 // FIXME: Change this to use the authService function to get the current user from localstorage
    };
  
    this.tasks.push(task);
    this.resetForm();
  }

  public showAddedTasks(): void {
    this.modalService.open(this.viewTasksModal, { size: 'lg' });
  }

  public async sendTasks(): Promise<void> {
    if (this.tasks.length === 0) return;

    const response = await this.taskService.createTasks(this.tasks);
    if (response.every(task => task.taskId)) {
      this.taskService.taskAdded.next(true);
      this.tasks = [];
    }

    this.tasks = [];
    this.modalService.close();
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

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return ("0" + d.getDate()).slice(-2)
      + "-" + ("0" + (d.getMonth() + 1)).slice(-2)
      + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  private resetForm(): void {
    this.form.reset()
    this.formSubmitted = false
  }
}
