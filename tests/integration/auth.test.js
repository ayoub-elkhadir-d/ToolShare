const assert = require('node:assert/strict')
const { after, before, test } = require('node:test')

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-for-auth-integration-tests'

const app = require('../../src/app')
const userRepository = require('../../src/repositories/user.repository')
const { verifyToken } = require('../../src/utils/jwt.util')

const userId = '507f1f77bcf86cd799439011'
const user = {
    _id: { toString: () => userId },
    name: 'Test User',
    email: 'test@example.com',
    password: '',
    role: 'USER',
    storeId: null,
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z')
}

const originalRepository = {
    create: userRepository.create,
    findByEmailWithPassword: userRepository.findByEmailWithPassword,
    findById: userRepository.findById
}

let server
let baseUrl

before(async () => {
    server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
    Object.assign(userRepository, originalRepository)
    await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve())
    })
})

test('registers a user with a bcrypt hash and returns a signed JWT', async () => {
    userRepository.create = async (userData) => {
        assert.notEqual(userData.password, 'password123')
        assert.equal(await require('bcryptjs').compare('password123', userData.password), true)
        assert.equal(userData.role, undefined)
        return { ...user, ...userData, password: undefined }
    }

    const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            name: ' Test User ',
            email: 'TEST@example.com',
            password: 'password123',
            role: 'ADMIN'
        })
    })

    assert.equal(response.status, 201)
    const body = await response.json()
    assert.equal(body.user.name, 'Test User')
    assert.equal(body.user.email, 'test@example.com')
    assert.equal(body.user.role, 'USER')
    assert.equal(Object.hasOwn(body.user, 'password'), false)
    assert.equal(verifyToken(body.token).sub, userId)
})

test('logs in with a password hash and rejects invalid credentials', async () => {
    const bcrypt = require('bcryptjs')
    userRepository.findByEmailWithPassword = async () => ({
        ...user,
        password: await bcrypt.hash('password123', 4)
    })

    const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'TEST@example.com', password: 'password123' })
    })

    assert.equal(response.status, 200)
    assert.equal(verifyToken((await response.json()).token).sub, userId)

    const invalidResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'TEST@example.com', password: 'wrong-password' })
    })

    assert.equal(invalidResponse.status, 401)
})

test('returns the authenticated profile and rejects missing or invalid tokens', async () => {
    userRepository.findById = async () => user

    const unauthenticated = await fetch(`${baseUrl}/api/v1/me`)
    assert.equal(unauthenticated.status, 401)

    const invalidToken = await fetch(`${baseUrl}/api/v1/me`, {
        headers: { authorization: 'Bearer invalid' }
    })
    assert.equal(invalidToken.status, 401)

    const token = require('../../src/utils/jwt.util').signToken(userId)
    const response = await fetch(`${baseUrl}/api/v1/me`, {
        headers: { authorization: `Bearer ${token}` }
    })

    assert.equal(response.status, 200)
    assert.deepEqual((await response.json()).user, {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: null,
        isActive: true,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
    })
})
