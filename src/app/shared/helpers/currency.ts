export const currencies = [
  {
    id: 1,
    name: 'ARS',
  },
  {
    id: 2,
    name: 'USD',
  }
]

export const getCurrencyName = (currencyId: number): string => {
  const currency = currencies[currencyId - 1]

  return currency ? currency.name : ''
}


export const getCurrencyId = (currencyName: string): number => {
  const currency = currencies.find(currency => currency.name.toLowerCase() === currencyName.toLowerCase())

  return currency ? currency.id : 0
}
