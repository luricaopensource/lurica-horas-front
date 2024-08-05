export interface ICompany {
  id?: number,
  name: string,
  address: string
  location: string
}

export interface IUsersToCompanies {
  id: number,
  name: string,
}

export interface IResponseCompany {
  companyId: number
}
