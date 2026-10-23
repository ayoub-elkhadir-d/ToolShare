const userRepository = require('../repositories/user.repository')
const { toPublicUser } = require('../services/auth.service')
const { verifyToken } = require('../utils/jwt.util')

async function authenticate(req, res, next) {
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({ message: 'Authentification requise ou jeton invalide.' })
    }

    const parts = authorization.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Authentification requise ou jeton invalide.' })
    }

    const token = parts[1]

    let payload
    try {
        payload = verifyToken(token)
    } catch (error) {
        return res.status(401).json({ message: 'Authentification requise ou jeton invalide.' })
    }

    if (!payload || !payload.sub) {
        return res.status(401).json({ message: 'Authentification requise ou jeton invalide.' })
    }

    const user = await userRepository.findById(payload.sub)

    if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Authentification requise ou jeton invalide.' })
    }

    req.user = toPublicUser(user)
    next()
}

function restrictTo(...roles) {
    return function (req, res, next) {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès refusé. Permissions insuffisantes.' })
        }
        next()
    }
}



module.exports = { 
    authenticate, 
    restrictTo, 
}