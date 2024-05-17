import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IResponseTask, ITask } from '../../models/tasks/tasks'

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private BASE_URL = environment.API_URL

  constructor(private readonly http: HttpClient) { }

  createTask(task: ITask): Promise<IResponseTask> {
    return firstValueFrom(this.http.post<IResponseTask>(`${this.BASE_URL}/tasks`, task))
  }
}
