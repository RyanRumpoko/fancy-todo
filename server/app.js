const express = require('express')
const router = require('./routes/index.js')
const app = express()
const port = 3000

app.set('view engin', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)

app.listen(port, () => console.log('Running on port: ', port))