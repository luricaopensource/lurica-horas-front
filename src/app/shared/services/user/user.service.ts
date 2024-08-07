import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IUser } from '../../models/users/user'
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

  createUser(user: IUser): Promise<IResponseModel> {
    return firstValueFrom(this.http.post<IResponseModel>(`${this.BASE_URL}/users`, user))
  }

  updateUser(user: IUser): Promise<IResponseModel> {
    return firstValueFrom(this.http.patch<IResponseModel>(`${this.BASE_URL}/users/${user.id}`, user))
  }

  getUsers(): Promise<IUser[]> {
    return firstValueFrom(this.http.get<IUser[]>(`${this.BASE_URL}/users`))
  }

  getCurrentUser(): Promise<IUser> {
    return firstValueFrom(this.http.get<IUser>(`${this.BASE_URL}/users/current`))
  }

  getUserFromLocalStorage(): IUser | null {
    const user = localStorage.getItem('user')

    if (user) {
      const userObject: IUser = JSON.parse(user)
      userObject.isAdmin = userObject.roleName === 'Administrador'

      return userObject
    }
    else return null
  }

  deleteUser(userId: number): Promise<IResponseModel> {
    return firstValueFrom(this.http.delete<IResponseModel>(`${this.BASE_URL}/users/${userId}`))
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("access_token") !== null
  }
}
