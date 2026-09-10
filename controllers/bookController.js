const Book = require("../models/books");
const Contributor = require("../models/contributor");
const Unit = require("../models/units");

module.exports.booksListing=async(req,res)=>{
    const books=await Book.find().populate({path:"subjects",populate:{path:"contributor"}});
    res.render("books.ejs",{books});
};
module.exports.removeBook=async(req,res)=>{
    const {id}=req.body;
    const unit=await Unit.findById(id);
    if (!unit) {
        req.flash("error", "Book not found");
        return res.redirect("/books");
    }
    const contributor=await Contributor.findById(unit.contributor);
    if (!contributor) {
        req.flash("error", "Contributor not found");
        return res.redirect("/books");
    }
    if(contributor.type=="Book"){
        await Book.findOneAndUpdate({semester:contributor.semester},{$pull: {subjects: id}});
        await Unit.findByIdAndDelete(id);
        req.flash("success", "Book removed successfully");
    }
    else{
        req.flash("error", "Contributor type is not Book");
    }
    res.redirect("/books");
}