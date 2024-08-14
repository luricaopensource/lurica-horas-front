export interface ITask {
  id?: number,
  projectId: number,
  milestoneId: number,
  description: string,
  dateFrom: string,
  dateTo: string,
  hours: number,
  type?: string,
  paid: boolean,
  status: string,
  userId: number
}


export interface IResponseTask {
  readonly id: number,
  userId: number
}
