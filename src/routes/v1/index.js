const express = require('express')
const { getHealth } = require('../../controllers/health.controller')
const { getMe } = require('../../controllers/auth.controller')
const { authenticate } = require('../../middlewares/auth.middleware')
const authRoutes = require('../auth.routes')

const router = express.Router()

router.get('/health', getHealth)
router.use('/auth', authRoutes)
router.get('/me', authenticate, getMe)

module.exports = router
