export interface DashboardItem {
  id: number
  date: string
  project: { id: number, name: string }
  milestone: { id: number, name: string }
  description: string
  hours: number
  status: string
  currency: string
  employee: { id: string, fullName: string, hourlyAmount: string, currencyName: string, amountType: string, blueQuoteAmount: string, officialQuoteAmount: string }
}
