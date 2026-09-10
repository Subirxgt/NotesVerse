const Contributor = require("../models/contributor");
const Pyq = require("../models/pyqs");
const Unit = require("../models/units");

module.exports.pyqsListing=async(req,res)=>{
    const pyqs=await Pyq.find().populate({path:"subjects",populate:{path:"contributor"}});
    res.render("pyqs.ejs",{pyqs});
};
module.exports.removePyq=async(req,res)=>{
    const {id}=req.body;
    const unit=await Unit.findById(id);
    if (!unit) {
        req.flash("error", "PYQ not found");
        return res.redirect("/pyqs");
    }
    const contributor=await Contributor.findById(unit.contributor);
    if (!contributor) {
        req.flash("error", "Contributor not found");
        return res.redirect("/pyqs");
    }
    if(contributor.type=="PYQ"){
        await Pyq.findOneAndUpdate({semester:contributor.semester},{$pull: {subjects: id}});
        await Unit.findByIdAndDelete(id);
        req.flash("success", "Pyq removed successfully");
    }
    else{
        req.flash("error", "Contributor type is not Pyq");
    }
    res.redirect("/pyqs");
}