export interface IMilestone {
  id?: number,
  name: string,
  date: string,
  totalAmount: number,
  paidAmount: number,
  surplusAmount: number
}

export interface IResponseMilestone {
  milestoneId: number
}
