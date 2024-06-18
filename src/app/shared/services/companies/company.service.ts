import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ICompany } from '../../models/companies/companies'

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private BASE_URL = environment.API_URL
  public projectCreated: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.projectCreated = new Subject<boolean>()
  }

  createCompany(company: ICompany): Promise<ICompany> {
    return firstValueFrom(this.http.post<ICompany>(`${this.BASE_URL}/companies`, company))
  }

  getCompanies(): Promise<ICompany[]> {
    return firstValueFrom(this.http.get<ICompany[]>(`${this.BASE_URL}/companies`))
  }

  deleteCompany(companyId: number): Promise<ICompany> {
    return firstValueFrom(this.http.delete<ICompany>(`${this.BASE_URL}/companies/${companyId}`))
  }
}
