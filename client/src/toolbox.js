export const array = (length) => [...Array(length).keys()]

export const get_new_id = (list) => Math.max(...list.map(({ id }) => id)) + 1

export const get_today_date = () => {
  const today = new Date()
  const date = today.toISOString().slice(0, 10)
  return date
}

export const get_total_amount = (array) =>
  array.reduce((acc, item) => {
    const amount = Number(item.amount) || 0
    return (acc = acc + amount)
  }, 0)

export const get_pro_amount = (faturas) =>
  faturas
    .filter((fatura) => fatura.scope !== 'perso')
    .reduce((acc, fatura) => {
      const number = Number(fatura.amount) || 0
      const amount = (fatura.scope === 'semi' && number * 0.25) || number
      return (acc = acc + amount)
    }, 0)
