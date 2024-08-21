export const currencies = [
  {
    id: 1,
    name: 'Pesos Argentinos',
  },
  {
    id: 2,
    name: 'Dólar Oficial',
  },
  {
    id: 3,
    name: 'Dólar Paralelo',
  }
]

export const DEFAULT_CURRENCY_ID = currencies[0].id
export const DEFAULT_CURRENCY_NAME = currencies[0].name

export const getCurrencyName = (currencyId: number): string => {
  if (!currencyId) currencyId = DEFAULT_CURRENCY_ID
  const currency = currencies[currencyId - 1]

  return currency ? currency.name : DEFAULT_CURRENCY_NAME
}


export const getCurrencyId = (currencyName: string): number => {
  if (!currencyName) currencyName = DEFAULT_CURRENCY_NAME

  const currency = currencies.find(currency => currency.name.toLowerCase() === currencyName.toLowerCase())

  return currency ? currency.id : DEFAULT_CURRENCY_ID
}
