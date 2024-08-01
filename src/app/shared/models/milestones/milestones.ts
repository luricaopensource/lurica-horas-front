export interface IMilestone {
  id?: number,
  name: string,
  date: string,
  amountPercentage: number
}

export interface IMilestoneCollapsible extends IMilestone {
  editMode: boolean
}

export interface INewMilestone {
  id?: number,
  name: string,
  date: string,
  amount: number,
  projectId: number
}
