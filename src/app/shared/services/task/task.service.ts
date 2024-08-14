import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IResponseTask, ITask } from '../../models/tasks/tasks'
import { IResponseModel } from '../../models'

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private BASE_URL = environment.API_URL
  public taskAdded: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.taskAdded = new Subject<boolean>()
  }

  createTasks(tasks: ITask[]): Promise<IResponseTask[]> {
    return firstValueFrom(this.http.post<IResponseTask[]>(`${this.BASE_URL}/tasks`, tasks))
  }

  deleteTask(taskId: number): Promise<IResponseModel> {
    return firstValueFrom(this.http.delete<IResponseModel>(`${this.BASE_URL}/tasks/${taskId}`))
  }

  editTask(task: ITask): Promise<IResponseModel> {
    return firstValueFrom(this.http.patch<IResponseTask>(`${this.BASE_URL}/tasks/${task.id}`, task))
  }

}
