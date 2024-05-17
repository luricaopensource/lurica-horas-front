export interface ITask {
  project: string,
  description: string,
  dateFrom: string,
  dateTo: string,
  hours: number,
  type: string,
  paid: boolean,
  status: string,
  currency: string,
  userId: number
}


export interface IResponseTask {
  taskId: number,
  userId: number
}
