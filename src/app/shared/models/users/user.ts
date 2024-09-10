import { IUsersToCompanies } from "../companies/companies"
import { IProject } from "../projects/projects"

export interface IUser {
  id?: number,
  firstName: string,
  lastName: string,
  username: string,
  password?: string,
  email: string,
  roleName?: string,
  role?: number,
  currencyName?: string,
  currency?: number,
  amount?: number,
  amountType?: number,
  amountTypeName?: string,
  companies?: IUsersToCompanies[]
  projects?: IProject[]
  userToProjects?: IUsersToProjects[]
  isAdmin?: boolean
  lastLogin?: string
}

export interface IResponseUser {
  userId: number
}

export interface IUsersToProjects {
  user: number
  project: number
  toDelete?: boolean
}
