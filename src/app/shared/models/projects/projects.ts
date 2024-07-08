import { ICompany } from "../companies/companies"

export interface IProject {
  id?: number,
  name: string,
  currency: string,
  company: ICompany
}

export interface INewProject {
  id?: number,
  name: string,
  currency: number,
  company: number
}

export interface IResponseProject {
  readonly id: number
}
