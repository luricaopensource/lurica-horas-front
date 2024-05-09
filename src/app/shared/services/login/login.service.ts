import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { User } from '../../models/users/user'
import { firstValueFrom } from 'rxjs'
import { ILoginData } from '../../models/login/login'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Promise<ILoginData> {
    return firstValueFrom(this.http.post<ILoginData>('http://localhost:3000/auth/login', { username, password }))
  }

  public register(user: User): Promise<any> {
    return firstValueFrom(this.http.post('http://localhost:3000/auth/register', user));
  }
}
