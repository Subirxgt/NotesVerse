const express=require('express');
const { homePage, contributionForm, rejection, acceptance } = require('../controllers/homeController');
const { upload } = require('../cloudconfig');
const { isAuthenticated } = require('../middlewares/auth');
const router=express.Router();

router.route("/")
    .get(homePage)
    .post(upload.single("file"),contributionForm)
router.route("/reject/:id")
    .get(rejection)
router.route("/approve/:id")
    .get(acceptance)

module.exports=router