import { IMilestone, IMilestoneCollapsible } from "../milestones/milestones"

export interface IProject {
  id?: number
  name: string
  currency: string
  amount: number | null
  milestones: IMilestone[]
}

export interface IProjectCollapsible extends IProject {
  editMode: boolean
  created: boolean
  showMilestones: boolean
  amountControlName?: string
  currencyControlName?: string
  nameControlName?: string
  milestones: IMilestoneCollapsible[]
}

export interface INewProject {
  id?: number
  name: string
  currency: number
  clientId: number
  amount: number
}

export interface IResponseProject {
  readonly id: number
}
