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

export const delete_data = (path, set_data) =>
  send_data('delete', `${path}`, set_data)
