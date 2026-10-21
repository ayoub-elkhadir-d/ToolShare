const express = require('express')
const router = express.Router();
const Book = require('./models/Book');

router.get('/books/available',async (req,res,next) =>{
    try{
        const book = await Book.find({})
    }catch(e){
        next(e);
    }
})

