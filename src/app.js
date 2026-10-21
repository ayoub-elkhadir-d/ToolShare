const express = require('express')
const routes = require('./routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(express.json())
app.use(routes)
app.use((req, res, next) => {
    const error = new Error(`Route introuvable : ${req.method} ${req.originalUrl}`)
    error.status = 404
    next(error)
})
app.use(errorMiddleware)

module.exports = app
