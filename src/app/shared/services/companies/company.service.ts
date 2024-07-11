import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ICompany } from '../../models/companies/companies'
import { IResponseModel } from '../../models'

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
    return firstValueFrom(this.http.post<ICompany>(`${this.BASE_URL}/company`, company))
  }

  updateCompany(company: ICompany): Promise<IResponseModel> {
    return firstValueFrom(this.http.patch<IResponseModel>(`${this.BASE_URL}/company/${company.id}`, company))
  }

  getCompanies(): Promise<ICompany[]> {
    return firstValueFrom(this.http.get<ICompany[]>(`${this.BASE_URL}/company`))
  }

  deleteCompany(companyId: number): Promise<ICompany> {
    return firstValueFrom(this.http.delete<ICompany>(`${this.BASE_URL}/company/${companyId}`))
  }
}
