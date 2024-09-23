import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'

interface GetReportsBody {
  employeeId?: number
  projectId?: number
  customerId?: number
  milestoneId?: number
  dateFrom?: string
  dateTo?: string
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private BASE_URL = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  async getPdf(body: GetReportsBody): Promise<Blob> {
    return firstValueFrom(
      this.http.post(`${this.BASE_URL}/reports/hours`, body, { responseType: 'arraybuffer' })
    ).then(response => new Blob([response], { type: 'application/pdf' }))
  }
}
