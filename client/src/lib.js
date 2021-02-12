import { atomizify, flagify } from 'atomizify'

atomizify({
  custom_classes: {
    mono: `font-family: 'IBM Plex Mono'`,
    h1: 'height: 1px',
    mr_auto: 'margin-right: auto',
  },
})

export const { Component, Div } = flagify()

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
export const update_data = (id, set_data, updated_value, timer) => {
  clearTimeout(is_editing)
  is_editing = setTimeout(() => {
    send_data('put', `faturas/${id}`, set_data, updated_value)
  }, timer || 1000)
}

export const delete_data = (id, set_data) =>
  send_data('delete', `faturas/${id}`, set_data)

export const array = (length) => [...Array(length).keys()]
export const add0 = (number) => number.toString().padStart(2, '0')
