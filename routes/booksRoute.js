const express=require('express');
const { booksListing, removeBook } = require('../controllers/bookController');
const router=express.Router();

router.get("/",booksListing);
router.post("/delete",removeBook);
module.exports=router;