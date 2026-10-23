const bcrypt = require('bcryptjs')
const userRepository = require('../repositories/user.repository')
const { signToken } = require('../utils/jwt.util')

const BCRYPT_ROUNDS = 12
const MAX_PASSWORD_BYTES = 72

function createError(message, statusCode) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

function validateCredentials({ name, email, password }, isRegistration = false) {
    if (isRegistration && (typeof name !== 'string' || !name.trim())) {
        throw createError('Le nom est obligatoire.', 400)
    }

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw createError('Une adresse e-mail valide est obligatoire.', 400)
    }

    if (typeof password !== 'string' ||
        (isRegistration && password.length < 8) ||
        Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
        throw createError(
            isRegistration
                ? 'Le mot de passe doit contenir au moins 8 caractères et au plus 72 octets.'
                : 'Identifiants invalides.',
            isRegistration ? 400 : 401
        )
    }
}

function toPublicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId ? user.storeId.toString() : null,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

function createAuthResponse(user) {
    return {
        token: signToken(user._id.toString()),
        user: toPublicUser(user)
    }
}

async function register(credentials = {}) {
    const { name, email, password } = credentials
    validateCredentials({ name, email, password }, true)

    let user
    try {
        user = await userRepository.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: await bcrypt.hash(password, BCRYPT_ROUNDS)
        })
    } catch (error) {
        if (error.code === 11000) {
            throw createError('Cette adresse e-mail est déjà utilisée.', 404)
        }
        throw error
    }

    return createAuthResponse(user)
}

async function login(credentials = {}) {
    const { email, password } = credentials
    validateCredentials({ email, password })

    const user = await userRepository.findByEmailWithPassword(email.trim().toLowerCase())
    if (!user || !user.isActive || !await bcrypt.compare(password, user.password)) {
        throw createError('Identifiants invalides.', 401)
    }

    return createAuthResponse(user)
}

module.exports = { register, login, toPublicUser }
