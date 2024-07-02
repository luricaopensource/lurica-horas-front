import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { INewUser, IResponseUser, IUser } from '../../models/users/user'
import { IResponseModel } from '../../models'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = environment.API_URL
  public userAdded: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.userAdded = new Subject<boolean>()
  }

  createUser(user: INewUser): Promise<IResponseModel> {
    return firstValueFrom(this.http.post<IResponseModel>(`${this.BASE_URL}/users`, user))
  }

  updateUser(user: IUser): Promise<IResponseModel> {
    return firstValueFrom(this.http.put<IResponseModel>(`${this.BASE_URL}/users/${user.id}`, user))
  }

  getUsers(): Promise<IUser[]> {
    return firstValueFrom(this.http.get<IUser[]>(`${this.BASE_URL}/users`))
  }

  getCurrentUser(): Promise<IUser> {
    return firstValueFrom(this.http.get<IUser>(`${this.BASE_URL}/users/current`))
  }

  getUserFromLocalStorage(): IUser | null {
    const user = localStorage.getItem('user')

    if (user) return JSON.parse(user)
    else return null
  }

  deleteUser(userId: number): Promise<IResponseModel> {
    return firstValueFrom(this.http.delete<IResponseModel>(`${this.BASE_URL}/users/${userId}`))
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("access_token") !== null
  }
}
