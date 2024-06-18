export interface IUser {
  id?: number,
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  email: string,
  role: string,
  currency?: string,
  hourlyAmount?: number,
  monthlyAmount?: number
}

export interface IResponseUser {
  userId: number
}
