import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Subject, firstValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'
import { INewProject, IProject, IResponseProject } from '../../models/projects/projects'
import { IResponseModel } from '../../models'
import { UserService } from '../user/user.service'
import { IUser } from '../../models/users/user'

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private BASE_URL = environment.API_URL
  public projectCreated: Subject<boolean>

  constructor(private readonly http: HttpClient, private readonly userService: UserService) {
    this.projectCreated = new Subject<boolean>()
  }

  createProject(project: INewProject): Promise<IResponseModel> {
    return firstValueFrom(this.http.post<IResponseProject>(`${this.BASE_URL}/projects`, project))
  }

  editProject(project: INewProject): Promise<IResponseModel> {
    return firstValueFrom(this.http.patch<IResponseProject>(`${this.BASE_URL}/projects/${project.id}`, project))
  }

  async getProjects(): Promise<IProject[]> {
    const currentUser: IUser | null = this.userService.getUserFromLocalStorage()

    if (!currentUser) return []

    let endpoint = `${this.BASE_URL}/projects`

    if (!currentUser.isAdmin) endpoint = endpoint.concat(`/employee/${currentUser.id}`)

    return firstValueFrom(this.http.get<IProject[]>(endpoint))
  }

  // getProjectsByEmployee(userId: number): Promise<IProject[]> {
  //   return firstValueFrom(this.http.get<IProject[]>(`${this.BASE_URL}/projects/employee/${userId}`))
  // }

  deleteProject(projectId: number): Promise<IResponseModel> {
    return firstValueFrom(this.http.delete<IResponseProject>(`${this.BASE_URL}/projects/${projectId}`))
  }
}
