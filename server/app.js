if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const router = require('./routes/index.js')
const errHandler = require('./middlewares/errorHandler.js')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)

app.use(errHandler)

app.listen(port, () => console.log('Running on port: ', port))