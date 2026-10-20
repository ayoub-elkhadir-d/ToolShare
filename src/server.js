const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.get('/',(req,res) =>{
    res.json({message: 'API ToolShare prete',env:process.env.NODE_ENV})
})

app.listen(PORT, () =>{
    console.log('Serveur demarré sur http://localhost:${PORT}')
})