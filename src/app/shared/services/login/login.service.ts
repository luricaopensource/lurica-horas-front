import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { IUser } from '../../models/users/user'
import { firstValueFrom } from 'rxjs'
import { ILoginData } from '../../models/login/login'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private BASE_URL = environment.API_URL
  private PASSWORD_MIN_LENGTH = 6
  private USERNAME_MIN_LENGTH = 5

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Promise<ILoginData> {
    return firstValueFrom(this.http.post<ILoginData>(`${this.BASE_URL}/auth/login`, { username, password }))
  }

  register(user: IUser): Promise<any> {
    return firstValueFrom(this.http.post('http://localhost:3000/auth/register', user))
  }

  logout(): void {
    this.deleteToken()
    this.router.navigate(['/login'])
  }

  getToken(): string {
    return localStorage.getItem('access_token') || ''
  }

  deleteToken(): void {
    localStorage.removeItem('access_token')
  }

  tokenHasExpired(): boolean {
    const token = this.getToken()
    if (!token) return true

    const tokenData = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = tokenData.exp * 1000
    return Date.now() >= expirationTime
  }

  getPasswordMinLength(): number {
    return this.PASSWORD_MIN_LENGTH
  }

  getUsernameMinLength(): number {
    return this.USERNAME_MIN_LENGTH
  }
}
