import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core'
import { TaskService } from '../../services/task/task.service'
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ITask } from '../../models/tasks/tasks'
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component'


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  public form: FormGroup = new FormGroup({})
  public formStatus: boolean = false
  @ViewChild(DashboardComponent, { static: false }) private dashboardComponent: DashboardComponent | undefined

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private taskService: TaskService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm()
  }


  private buildForm(): void {
    this.form = this.formBuilder.group({
      project: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      type: ['', [Validators.required]],
      currency: ['', [Validators.required]]
    })
  }

  public async createTask(): Promise<void> {
    if (this.form.invalid) {
      this.formStatus = true
      return
    }

    const { project, description, dateFrom, dateTo, type, currency } = this.form.value
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
      type,
      paid: false,
      status: 'Pendiente',
      currency,
      userId: 1 // FIXME: Change this to use the authService function to get the current user from localstorage
    }

    this.dialogRef.close()
    const response = await this.taskService.createTask(task)
    // if (response.taskId)
    this.taskService.taskAdded.next(true)
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
}
