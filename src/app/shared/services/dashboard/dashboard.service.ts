import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { DashboardItem } from 'src/app/pages/dashboard/dashboard-datasource'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private BASE_URL = environment.API_URL

  constructor(private readonly http: HttpClient) { }

  getDashboardData(): Promise<DashboardItem[]> {
    return firstValueFrom(this.http.get<DashboardItem[]>(`${this.BASE_URL}/tasks`))
  }
}
