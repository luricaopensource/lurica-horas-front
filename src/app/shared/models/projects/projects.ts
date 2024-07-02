export interface IProject {
  id?: number,
  name: string,
  currency: string,
  companyName: string
}

export interface INewProject {
  name: string,
  currency: number,
  companyId: number
}

export interface IResponseProject {
  readonly id: number
}
