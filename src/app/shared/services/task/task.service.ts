import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { DashboardItem } from 'src/app/pages/dashboard/dashboard-datasource'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private BASE_URL = environment.API_URL
  private posts: Task[] = []

  constructor(private readonly http: HttpClient) { }

  createTask(): Promise<any> {
    const post = {
      "dateFrom": "2024-03-25T16:02:00",
      "dateTo": "2024-03-26T16:02:00",
      "hours": 1,
      "description": "Ticket de prueba",
      "type": "Desarrollo",
      "paid": false,
      "status": "Pendiente",
      "userId": 1
    }

    return firstValueFrom(this.http.post(`${this.BASE_URL}/tasks`, post))
  }

  setPosts(posts: Task[]): void {
    this.posts = posts
  }
}
