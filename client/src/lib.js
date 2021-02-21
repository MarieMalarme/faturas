import { atomizify, flagify } from 'atomizify'

atomizify({
  custom_classes: {
    mono: `font-family: 'IBM Plex Mono'`,
    h1: 'height: 1px',
    h4: 'height: 4px',
    mr_auto: 'margin-right: auto',
    w_fit_content: 'width: fit-content',
  },
})

export const { Component, Div } = flagify()

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

export const fetch_data = async (path, set_data) => {
  const response = await fetch(`http://localhost:5000/${path}`)
  const data = await response.json()
  if (!data) return
  set_data(data)
}

export const send_data = (method, path, set_data, data) =>
  fetch(`http://localhost:5000/${path}`, {
    method: method.toUpperCase(),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => set_data(res))

let is_editing
export const update_data = (path, set_data, updated_value, timer) => {
  clearTimeout(is_editing)
  is_editing = setTimeout(() => {
    send_data('put', path, set_data, {
      ...updated_value,
      updated_at: new Date(),
    })
  }, timer || 0)
}

export const delete_data = (id, set_data) =>
  send_data('delete', `faturas/${id}`, set_data)

export const get_today_date = () => {
  const today = new Date()
  const date = today.toISOString().slice(0, 10)
  return date
}

export const array = (length) => [...Array(length).keys()]
