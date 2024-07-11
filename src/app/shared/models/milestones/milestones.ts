export interface IMilestone {
  id: number,
  name: string,
  date: string,
  totalAmount: number,
  paidAmount: number,
  surplusAmount: number,
  projectName: string
}

export interface INewMilestone {
  id?: number,
  name: string,
  date: string,
  totalAmount: number,
  paidAmount: number,
  surplusAmount: number,
  projectId: number
}
