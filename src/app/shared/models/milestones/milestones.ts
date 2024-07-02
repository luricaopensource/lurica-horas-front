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
  name: string,
  date: string,
  totalAmount: number,
  paidAmount: number,
  surplusAmount: number,
  projectId: number
}
