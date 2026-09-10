const Note = require("../models/notes");
const Unit=require("../models/units");
const Subject = require("../models/subjects");
const Contributor = require("../models/contributor");

module.exports.notesListing=async(req,res)=>{
    const notes=await Note.find().populate({path:"subjects",populate:{path:"units",populate:{path:"contributor"}}});
    res.render("notes.ejs",{notes});
}
module.exports.subjectsListing=async(req,res)=>{
    const id=req.params.id;
    const subject=await Subject.findById(id).populate({path:"units",populate:{path:"contributor"}});
    res.render("subjects.ejs",{subject});
}
module.exports.dsaNotesListing=async(req,res)=>{
    const dsaNotes=await Unit.find({parent:"DSA_Notes"}).populate({path:"contributor"});
    res.render("dsa.ejs",{dsaNotes});
}
module.exports.removeDsaUnit=async(req,res)=>{
    const unitId=req.body.id;
    const unit=await Unit.findById(unitId);
    if (!unit) {
        req.flash("error", "Unit not found");
        return res.redirect("/notes");
    }
    const contributor=await Contributor.findById(unit.contributor);
    if (!contributor) {
        req.flash("error", "Contributor not found");
        return res.redirect("/notes");
    }
    if(contributor.type==="DSA_Notes"){
        await Unit.findByIdAndDelete(unitId);
        req.flash("success", "DSA Notes removed successfully");
    }
    else{
        req.flash("error", "Contributor type is not DSA Note");
    }
    res.redirect("/notes/dsaNotes");
}
module.exports.removeUnit=async(req,res)=>{
    const unitId=req.body.id;
    const subjectId=req.params.id;
    const unit=await Unit.findById(unitId);
    if (!unit) {
        req.flash("error", "Unit not found");
        return res.redirect("/notes");
    }
    const contributor=await Contributor.findById(unit.contributor);
    if (!contributor) {
        req.flash("error", "Contributor not found");
        return res.redirect("/notes");
    }
    if(contributor.type=="Note"){
        await Subject.findOneAndUpdate({_id:subjectId},{$pull: {units: unitId}});
        await Unit.findByIdAndDelete(unitId);
        req.flash("success", "Notes removed successfully");
    }
    else{
        req.flash("error", "Contributor type is not Note");
    }
    res.redirect("/notes");
}