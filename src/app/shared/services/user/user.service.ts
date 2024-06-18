import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IResponseUser, IUser } from '../../models/users/user'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = environment.API_URL
  public userAdded: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.userAdded = new Subject<boolean>()
  }

  createUser(user: IUser): Promise<IUser> {
    return firstValueFrom(this.http.post<IUser>(`${this.BASE_URL}/users`, user))
  }

  getUsers(): Promise<IUser[]> {
    return firstValueFrom(this.http.get<IUser[]>(`${this.BASE_URL}/users`))
  }

  deleteUser(userId: number): Promise<IUser> {
    return firstValueFrom(this.http.delete<IUser>(`${this.BASE_URL}/users/${userId}`))
  }

  getUserRole(role: string): number {
    switch (role) {
      case 'administrador':
        return 1
      case 'consultor':
        return 2
      default:
        return 3
    }
  }

  getUserCurrency(currency: string): number {
    switch (currency) {
      case 'ars':
        return 1
      default:
        return 2
    }
  }
}
