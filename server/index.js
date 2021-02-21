const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

const fs = require('fs')
const util = require('util')
const path = require('path')
const read_file = util.promisify(fs.readFile)
const write_file = util.promisify(fs.writeFile)
const body_parser = require('body-parser')

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))
app.use(cors())

const invoices_file_path = path.join(__dirname, `./invoices.data.json`)

app.get('/invoices', (req, res, next) => {
  read_file(invoices_file_path, 'utf8')
    .then((data) => res.json(JSON.parse(data)))
    .catch(next)
})

app.put('/invoices/:id', (req, res, next) => {
  handle_data(req, res, next, invoices_file_path)
})

const faturas_file_path = path.join(__dirname, `./faturas.data.json`)

app.get('/faturas', (req, res, next) => {
  read_file(faturas_file_path, 'utf8')
    .then((data) => res.json(JSON.parse(data)))
    .catch(next)
})

app.post('/faturas', (req, res, next) => {
  handle_data(req, res, next, faturas_file_path)
})

app.put('/faturas/:id', (req, res, next) => {
  handle_data(req, res, next, faturas_file_path)
})

app.delete('/faturas/:id', (req, res, next) => {
  handle_data(req, res, next, faturas_file_path)
})

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})

const handle_data = (req, res, next, path) => {
  const posting = req.method === 'POST'
  const updating = req.method === 'PUT'
  const deleting = req.method === 'DELETE'

  read_file(path, 'utf8')
    .then(JSON.parse)
    .then(async (data) => {
      const kept = data.filter((d) => !matching_ids(d.id, req.params.id))
      const target = data.find((d) => matching_ids(d.id, req.params.id))

      data =
        (posting && [...data, req.body]) ||
        (updating && [...kept, { ...target, ...req.body }]) ||
        (deleting && kept) ||
        data

      const sorted_data = data.sort((a, b) => a.id - b.id)
      const json_data = JSON.stringify(sorted_data, null, 2)
      await write_file(path, json_data, 'utf-8')
      res.json(sorted_data)
    })
    .catch(next)
}

const matching_ids = (id, compared_id) => Number(id) === Number(compared_id)
