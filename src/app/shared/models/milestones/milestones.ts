export interface IMilestone {
  id: number,
  name: string,
  date: string,
  amount: number,
  projectName: string
}

export interface INewMilestone {
  id?: number,
  name: string,
  date: string,
  amount: number,
  projectId: number
}
