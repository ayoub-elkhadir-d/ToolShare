const authService = require('../services/auth.service')

async function register(req, res) {
    const result = await authService.register(req.body)
    res.status(201).json(result)
}

async function login(req, res) {
    const result = await authService.login(req.body)
    res.json(result)
}

function getMe(req, res) {
    res.json({ user: req.user })
}

module.exports = { register, login, getMe }
