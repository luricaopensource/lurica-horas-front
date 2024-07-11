import { IClient } from "../clients/clients"

export interface IProject {
  id?: number,
  name: string,
  currency: string,
  client: IClient,
  amount: number
}

export interface INewProject {
  id?: number,
  name: string,
  currency: number,
  client: number,
  amount: number
}

export interface IResponseProject {
  readonly id: number
}
