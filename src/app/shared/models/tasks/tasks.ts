export interface ITask {
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
  taskId: number,
  userId: number
}
