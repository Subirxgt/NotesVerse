const express=require('express');
const { pyqsListing, removePyq } = require('../controllers/pyqController');
const router=express.Router();

router.get("/",pyqsListing);
router.post("/delete",removePyq);

module.exports=router;