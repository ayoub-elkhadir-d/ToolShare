const express = require('express')
const routes = require('./routes')
const AppError = require('./utils/appError')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(express.json())
app.use(routes)
app.use((req, res, next) => {
    next(new AppError(`Route introuvable : ${req.method} ${req.originalUrl}` ,404))
})
app.use(errorMiddleware)

module.exports = app
