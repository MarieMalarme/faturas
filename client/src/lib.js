import { atomizify, flagify } from 'atomizify'

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

export const update_data = (id, set_data, updated_value) => {
  console.log('ici')
  send_data('put', `faturas/${id}`, set_data, updated_value)
}

export const delete_data = (id, set_data) => {
  send_data('delete', `faturas/${id}`, set_data)
}

atomizify({ custom_classes: { mono: `font-family: 'IBM Plex Mono'` } })
export const { Component } = flagify()
