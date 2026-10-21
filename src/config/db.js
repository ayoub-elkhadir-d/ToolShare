const mongoose = require('mongoose')

async function connectDB() {
    const mongoUri = process.env.MONGO_URI

    if (!mongoUri) {
        throw new Error('La variable MONGO_URI est obligatoire.')
    }

    await mongoose.connect(mongoUri)
    console.log('Connexion MongoDB établie.')
}

module.exports = connectDB
