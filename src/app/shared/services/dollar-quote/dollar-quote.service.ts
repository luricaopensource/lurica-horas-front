import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DollarQuote } from '../../models/dollar-quote/dollar-quote'
import { environment } from 'src/environments/environment'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DollarQuoteService {
  private BASE_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  getDollarQuote(): Promise<DollarQuote> {
    return firstValueFrom(this.http.get<DollarQuote>(`${this.BASE_URL}/dollar-quote`))
  }

  saveDollarQuote(data: DollarQuote): Promise<DollarQuote> {
    return firstValueFrom(this.http.post<DollarQuote>(`${this.BASE_URL}/dollar-quote`, data))
  }
}
