import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { DashboardItem } from 'src/app/pages/dashboard/dashboard-datasource'
import { environment } from 'src/environments/environment'
import { NavbarComponent } from '../../components/navbar/navbar.component'
import { UserService } from '../user/user.service'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private BASE_URL = environment.API_URL

  constructor(private readonly http: HttpClient, private readonly userService: UserService) { }

  getDashboardData(): Promise<DashboardItem[]> {
    const userRole = this.getCurrentUser().roleName;
    const userId = this.getCurrentUser().id;
    if (userRole == 'admin') return firstValueFrom(this.http.get<DashboardItem[]>(`${this.BASE_URL}/tasks`))

    return firstValueFrom(this.http.get<DashboardItem[]>(`${this.BASE_URL}/tasks/employee/${userId}`))
  }

  public getCurrentUser() {
    const user = this.userService.getUserFromLocalStorage()

    return user!;
  }


}
