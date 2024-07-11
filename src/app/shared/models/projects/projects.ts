import { ICompany } from "../companies/companies"

export interface IProject {
  id?: number,
  name: string,
  currency: string,
  company: ICompany,
  amount: number
}

export interface INewProject {
  id?: number,
  name: string,
  currency: number,
  company: number,
  amount: number
}

export interface IResponseProject {
  readonly id: number
}
