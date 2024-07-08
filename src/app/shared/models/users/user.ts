export interface IUser {
  id?: number,
  firstName: string,
  lastName: string,
  username: string,
  password?: string,
  email: string,
  roleName?: string,
  role?: number,
  currencyName?: string,
  currency?: number,
  hourlyAmount?: number,
  monthlyAmount?: number
}

export interface IResponseUser {
  userId: number
}
