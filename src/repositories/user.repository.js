const User = require('../models/user.model')

function create(userData) {
    return User.create(userData)
}

function findByEmailWithPassword(email) {
    return User.findOne({ email }).select('+password')
}

function findById(id) {
    return User.findById(id)
}

module.exports = { create, findByEmailWithPassword, findById }
