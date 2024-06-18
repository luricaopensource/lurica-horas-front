import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IMilestone } from '../../models/milestones/milestones'

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {
  private BASE_URL = environment.API_URL
  public projectCreated: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.projectCreated = new Subject<boolean>()
  }

  createMilestone(milestone: IMilestone): Promise<IMilestone> {
    return firstValueFrom(this.http.post<IMilestone>(`${this.BASE_URL}/milestones`, milestone))
  }

  getCompanies(): Promise<IMilestone[]> {
    return firstValueFrom(this.http.get<IMilestone[]>(`${this.BASE_URL}/milestones`))
  }

  deleteMilestone(milestoneId: number): Promise<IMilestone> {
    return firstValueFrom(this.http.delete<IMilestone>(`${this.BASE_URL}/milestones/${milestoneId}`))
  }
}
