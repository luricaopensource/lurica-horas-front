import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { IProject } from '../../models/projects/projects'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private BASE_URL = environment.API_URL
  public projectCreated: Subject<boolean>

  constructor(private readonly http: HttpClient) {
    this.projectCreated = new Subject<boolean>()
  }

  createProject(project: IProject): Promise<IProject> {
    return firstValueFrom(this.http.post<IProject>(`${this.BASE_URL}/projects`, project))
  }

  getProjects(): Promise<IProject[]> {
    return firstValueFrom(this.http.get<IProject[]>(`${this.BASE_URL}/projects`))
  }

  deleteProject(projectId: number): Promise<IProject> {
    return firstValueFrom(this.http.delete<IProject>(`${this.BASE_URL}/projects/${projectId}`))
  }
}
