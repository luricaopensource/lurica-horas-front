import { Component } from '@angular/core'
import { TaskService } from '../../services/task/task.service'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(private dialogRef: MatDialogRef<DialogComponent>, private taskService: TaskService) { }

  createTask(): void {
    this.dialogRef.close()
    console.log('Creating task...')
    this.taskService.createTask()
  }
}
