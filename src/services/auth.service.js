const bcrypt = require('bcryptjs')
const userRepository = require('../repositories/user.repository')
const { signToken } = require('../utils/jwt.util')

function toPublicUser(user) {
    let storeId = null
    if (user.storeId) {
        storeId = user.storeId.toString()
    }

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: storeId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
}

async function register(data) {
    const name = data.name
    const email = data.email
    const password = data.password

    if (!name || name.trim() === '') {
        const error = new Error('Le nom est obligatoire.')
        error.statusCode = 400
        throw error
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
        const error = new Error('Une adresse e-mail valide est obligatoire.')
        error.statusCode = 400
        throw error
    }

    if (!password || password.length < 8) {
        const error = new Error('Le mot de passe doit contenir au moins 8 caractères.')
        error.statusCode = 400
        throw error
    }

    const cleanEmail = email.trim().toLowerCase()

    const existingUser = await userRepository.findByEmailWithPassword(cleanEmail)
    if (existingUser) {
        const error = new Error('Cette adresse e-mail est déjà utilisée.')
        error.statusCode = 400
        throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userRepository.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword
    })

    const token = signToken(user._id.toString())
    return {
        token: token,
        user: toPublicUser(user)
    }
}

async function login(data) {
    const email = data.email
    const password = data.password

    if (!email || !password) {
        const error = new Error('Identifiants invalides.')
        error.statusCode = 401
        throw error
    }

    const cleanEmail = email.trim().toLowerCase()
    const user = await userRepository.findByEmailWithPassword(cleanEmail)

    if (!user || !user.isActive) {
        const error = new Error('Identifiants invalides.')
        error.statusCode = 401
        throw error
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    if (!passwordIsCorrect) {
        const error = new Error('Identifiants invalides.')
        error.statusCode = 401
        throw error
    }

    const token = signToken(user._id.toString())
    return {
        token: token,
        user: toPublicUser(user)
    }
}

module.exports = { register, login, toPublicUser }