import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IClient } from '../../models/clients/clients'
import { IResponseModel } from '../../models'

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private BASE_URL = environment.API_URL
  public projectCreated: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.projectCreated = new Subject<boolean>()
  }

  createClient(client: IClient): Promise<IClient> {
    return firstValueFrom(this.http.post<IClient>(`${this.BASE_URL}/client`, client))
  }

  updateClient(client: IClient): Promise<IResponseModel> {
    return firstValueFrom(this.http.patch<IResponseModel>(`${this.BASE_URL}/client/${client.id}`, client))
  }

  getClients(): Promise<IClient[]> {
    return firstValueFrom(this.http.get<IClient[]>(`${this.BASE_URL}/client`))
  }

  deleteClient(clientId: number): Promise<IClient> {
    return firstValueFrom(this.http.delete<IClient>(`${this.BASE_URL}/client/${clientId}`))
  }
}
