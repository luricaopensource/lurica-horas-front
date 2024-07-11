import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IResponseTask, ITask } from '../../models/tasks/tasks'

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
}
