function errorMiddleware(error, req, res, next) {
    if (res.headersSent) {
        return next(error)
    }

    const status = Number.isInteger(error.statusCode)
        ? error.statusCode
        : Number.isInteger(error.status)
            ? error.status
            : 500
    const statusCode = status >= 400 && status < 600 ? status : 500
    const isServerError = statusCode >= 500

    if (isServerError) {
        console.error('Erreur interne de l’API :', error)
    }

    res.status(statusCode).json({
        message: isServerError ? 'Erreur interne du serveur' : error.message
    })
}

module.exports = errorMiddleware
