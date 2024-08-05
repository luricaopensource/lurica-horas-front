import { IProject, IProjectCollapsible } from "../projects/projects"

export interface IClient {
  id?: number,
  name: string,
  projects?: IProject[]
}

export interface IClientCollapsible extends IClient {
  created?: boolean,
  editMode: boolean,
  showProjects: boolean,
  projects: IProjectCollapsible[]
}

export interface IResponseClient {
  clientId: number
}
