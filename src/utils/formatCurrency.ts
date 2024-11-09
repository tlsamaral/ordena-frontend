export const formatValueToMoney = (value: number, currency = 'BRL') => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency,
  })
}

export const formatCurrency = (value: string) => {
  const cleanValue = value.replace(/\D/g, '')
  const formattedValue = (Number(cleanValue) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return formattedValue
}
