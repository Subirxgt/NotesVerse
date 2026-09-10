const express=require('express');
const { notesListing, subjectsListing, removeUnit, dsaNotesListing, removeDsaUnit } = require('../controllers/NotesController');
const router=express.Router();

router.route("/")
    .get(notesListing);
router.route("/dsaNotes")
    .get(dsaNotesListing);

router.post("/dsaNotes/:id/delete",removeDsaUnit);
router.route("/subjects/:id")
    .get(subjectsListing)
router.post("/subjects/:id/delete",removeUnit);

module.exports=router;