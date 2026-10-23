const userRepository = require('../repositories/user.repository')
const { toPublicUser } = require('../services/auth.service')
const { verifyToken } = require('../utils/jwt.util')
const AppError = require('../utils/appError')

async function authenticate(req, res, next) {
    const authorization = req.headers.authorization

  if (!authorization) {
    return next(new AppError( 'Authentification requise ou jeton invalide.' ,401))

    }

    const parts = authorization.split(' ')

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return next(new AppError( 'Authentification requise ou jeton invalide.' ,401))

    }

    const token = parts[1]

    let payload
    try {
        payload = verifyToken(token)
    } catch (error) {
      return next(new AppError( 'Authentification requise ou jeton invalide.' ,401))

    }

  if (!payload || !payload.sub) {
        return next(new AppError( 'Authentification requise ou jeton invalide.' ,401))

    }

    const user = await userRepository.findById(payload.sub)

  if (!user || !user.isActive) {
        return next(new AppError( 'Authentification requise ou jeton invalide.' ,401))
    }

    req.user = toPublicUser(user)
    next()
}

function restrictTo(...roles) {
    return function (req, res, next) {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError( 'Accès refusé. Permissions insuffisantes.' ,403))
        }
        next()
    }
}



module.exports = { 
    authenticate, 
    restrictTo, 
}