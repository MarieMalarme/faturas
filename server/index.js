const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

const fs = require('fs')
const util = require('util')
const path = require('path')
const read_file = util.promisify(fs.readFile)

app.use(cors())

const file_path = path.join(__dirname, `./faturas.data.json`)

app.get('/faturas', (req, res, next) => {
  read_file(file_path, 'utf8')
    .then((data) => res.json(JSON.parse(data)))
    .catch(next)
})

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})
