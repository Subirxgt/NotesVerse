const express=require('express');
const { practicalsListing, removePractical } = require('../controllers/practicalController');
const router=express.Router();

router.get("/",practicalsListing);
router.post("/delete",removePractical);

module.exports=router;