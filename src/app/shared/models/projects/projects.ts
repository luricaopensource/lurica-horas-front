import { IClient } from "../clients/clients"
import { IMilestone, IMilestoneCollapsible } from "../milestones/milestones"

export interface IProject {
  id?: number,
  name: string,
  currency: string,
  amount: number,
  milestones: IMilestone[]
}

export interface IProjectCollapsible extends IProject {
  created: boolean,
  editMode: boolean,
  showMilestones: boolean,
  milestones: IMilestoneCollapsible[]
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
