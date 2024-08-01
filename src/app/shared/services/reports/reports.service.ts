import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private readonly http: HttpClient) { }

  async getPdf(): Promise<Blob> {
    return firstValueFrom(
      this.http.post('http://localhost:3000/reports/hours', { customerId: 1 }, { responseType: 'arraybuffer' })
    ).then(response => new Blob([response], { type: 'application/pdf' }))
  }
}
