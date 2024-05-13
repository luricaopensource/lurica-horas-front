import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { User } from '../../models/users/user'
import { firstValueFrom } from 'rxjs'
import { ILoginData } from '../../models/login/login'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private BASE_URL = environment.API_URL

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Promise<ILoginData> {
    return firstValueFrom(this.http.post<ILoginData>(`${this.BASE_URL}/auth/login`, { username, password }))
  }

  public register(user: User): void {
    const json: string = JSON.stringify(user)

    console.log(json)

    // return this.http.post('http://localhost:3000/users/register', json)
  }
}
