import { Component, OnInit } from '@angular/core'
import { TaskService } from '../../services/task/task.service'
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ITask } from '../../models/tasks/tasks'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  public form: FormGroup = new FormGroup({})

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

  public createTask(): void {
    console.log(this.form.value)
    const { project, description, dateFrom, dateTo, type, currency } = this.form.value
    const from = new Date(dateFrom)
    const to = new Date(dateTo)

    if (from > to) return // FIXME: Show error in form

    const hours = this.getHours(from, to)

    const task: ITask = {
      project,
      description,
      dateFrom: new Date(dateFrom).toISOString(),
      dateTo: new Date(dateTo).toISOString(),
      hours,
      type,
      paid: false,
      status: 'pending',
      currency,
      userId: 1 // FIXME: Change this to use the authService function to get the current user from localstorage
    }

    console.log(task)

    this.dialogRef.close()
    // this.taskService.createTask(task)
  }

  private getHours(dateFrom: Date, dateTo: Date): number {
    console.log('From: ', dateFrom)
    console.log('To: ', dateTo)

    let diff = (dateFrom.getTime() - dateTo.getTime()) / 1000
    diff /= (60 * 60)
    return Math.abs(Math.round(diff))
  }
}
