import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { INewProject, IProject, IResponseProject } from '../../models/projects/projects'
import { IResponseModel } from '../../models'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private BASE_URL = environment.API_URL
  public projectCreated: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.projectCreated = new Subject<boolean>()
  }

  createProject(project: INewProject): Promise<IResponseModel> {
    return firstValueFrom(this.http.post<IResponseProject>(`${this.BASE_URL}/projects`, project))
  }

  editProject(project: INewProject): Promise<IResponseModel> {
    return firstValueFrom(this.http.patch<IResponseProject>(`${this.BASE_URL}/projects/${project.id}`, project))
  }

  getProjects(): Promise<IProject[]> {
    return firstValueFrom(this.http.get<IProject[]>(`${this.BASE_URL}/projects`))
  }

  deleteProject(projectId: number): Promise<IResponseModel> {
    return firstValueFrom(this.http.delete<IResponseProject>(`${this.BASE_URL}/projects/${projectId}`))
  }
}
