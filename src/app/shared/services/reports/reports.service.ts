import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'

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

  constructor(private readonly http: HttpClient) { }

  async getPdf(body: GetReportsBody): Promise<Blob> {
    return firstValueFrom(
      this.http.post('http://localhost:3000/reports/hours', body, { responseType: 'arraybuffer' })
    ).then(response => new Blob([response], { type: 'application/pdf' }))
  }
}
