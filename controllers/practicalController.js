const Contributor = require("../models/contributor");
const Practical = require("../models/practicals");
const Unit = require("../models/units");

module.exports.practicalsListing=async(req,res)=>{
    const practicals=await Practical.find().populate({path:"subjects",populate:{path:"contributor"}});
    res.render("practicals.ejs",{practicals});
};
module.exports.removePractical=async(req,res)=>{
    const {id}=req.body;
    const unit=await Unit.findById(id);
    if (!unit) {
        req.flash("error", "Practical not found");
        return res.redirect("/practicals");
    }
    const contributor=await Contributor.findById(unit.contributor);
    if (!contributor) {
        req.flash("error", "Contributor not found");
        return res.redirect("/practicals");
    }
    if(contributor.type=="Practical"){
        await Practical.findOneAndUpdate({semester:contributor.semester},{$pull: {subjects: id}});
        await Unit.findByIdAndDelete(id);
        req.flash("success", "Practical removed successfully");
    }
    else{
        req.flash("error", "Contributor type is not Practical");
    }
    res.redirect("/practicals");
}