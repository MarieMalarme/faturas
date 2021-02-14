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

const invoiced_file_path = path.join(__dirname, `./invoiced.data.json`)

app.get('/faturas/invoiced', (req, res, next) => {
  read_file(invoiced_file_path, 'utf8')
    .then((data) => res.json(JSON.parse(data)))
    .catch(next)
})

app.put('/faturas/invoiced', (req, res, next) => {
  const json_data = JSON.stringify({ ...req.body }, null, 2)
  write_file(invoiced_file_path, json_data, 'utf-8')
  res.json(json_data)
})

const faturas_file_path = path.join(__dirname, `./faturas.data.json`)

app.get('/faturas', (req, res, next) => {
  read_file(faturas_file_path, 'utf8')
    .then((data) => res.json(JSON.parse(data)))
    .catch(next)
})

app.post('/faturas', (req, res, next) => {
  handle_data(req, res, next)
})

app.put('/faturas/:fatura_id', (req, res, next) => {
  handle_data(req, res, next)
})

app.delete('/faturas/:fatura_id', (req, res, next) => {
  handle_data(req, res, next)
})

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})

const handle_data = (req, res, next) => {
  const posting = req.method === 'POST'
  const updating = req.method === 'PUT'
  const deleting = req.method === 'DELETE'

  read_file(faturas_file_path, 'utf8')
    .then(JSON.parse)
    .then(async (faturas) => {
      const kept = faturas.filter(
        (d) => !matching_ids(d.id, req.params.fatura_id),
      )
      const target = faturas.find((d) =>
        matching_ids(d.id, req.params.fatura_id),
      )

      faturas =
        (posting && [...faturas, req.body]) ||
        (updating && [...kept, { ...target, ...req.body }]) ||
        (deleting && kept) ||
        faturas

      const sorted_faturas = faturas.sort((a, b) => a.id - b.id)
      const json_data = JSON.stringify(sorted_faturas, null, 2)
      await write_file(faturas_file_path, json_data, 'utf-8')
      res.json(sorted_faturas)
    })
    .catch(next)
}

const matching_ids = (id, compared_id) => Number(id) === Number(compared_id)
