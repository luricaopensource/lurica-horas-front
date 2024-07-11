import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IMilestone, INewMilestone } from '../../models/milestones/milestones'
import { IResponseModel } from '../../models'

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {
  private BASE_URL = environment.API_URL
  public projectCreated: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.projectCreated = new Subject<boolean>()
  }

  createMilestone(milestone: INewMilestone): Promise<IResponseModel> {
    return firstValueFrom(this.http.post<IResponseModel>(`${this.BASE_URL}/milestone`, milestone))
  }

  updateMilestone(milestone: INewMilestone): Promise<IResponseModel> {
    return firstValueFrom(this.http.patch<IResponseModel>(`${this.BASE_URL}/milestone/${milestone.id}`, milestone))
  }

  getMilestones(): Promise<IMilestone[]> {
    return firstValueFrom(this.http.get<IMilestone[]>(`${this.BASE_URL}/milestone`))
  }

  deleteMilestone(milestoneId: number): Promise<IResponseModel> {
    return firstValueFrom(this.http.delete<IResponseModel>(`${this.BASE_URL}/milestone/${milestoneId}`))
  }
}
