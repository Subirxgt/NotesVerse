const Book = require("../models/books");
const Subject=require('../models/subjects');
const Contributor = require("../models/contributor");
const Note = require("../models/notes");
const Practical = require("../models/practicals");
const Pyq = require("../models/pyqs");
const Unit = require("../models/units");
const path=require('path');
const { acceptanceMessage } = require("../utils/acceptanceMessage");
const { receivedMessage } = require("../utils/receivedMessage");
const { rejectionMessage } = require("../utils/rejectionMessage");
const { sendApproval } = require("../utils/sendApproval");
const { cloudinary } = require("../cloudconfig");

module.exports.homePage=async(req,res)=>{
    res.render("home.ejs");
}
module.exports.contributionForm=async(req, res, next) => {
  try {
    let fileUrl = null;
    const {name, email } = req.user;
    const contributor = req.body.contributor;
    contributor.username=name;
    contributor.email=email;
    if (req.file && req.file.path) {
      let title = contributor.title || "file";
      title = title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      const ext = path.extname(req.file.originalname);
      const publicId = `${title}_${Date.now()}${ext}`;

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "contributors",
        public_id: publicId,
        overwrite: true,
      });

      fileUrl = result.secure_url;

      req.flash(
        "success",
        "🎉 File received! Thanks for contributing to StudyAdda. Our review team will check your submission and notify you about approval soon."
      );
    } else if (contributor.driveLink) {
      fileUrl = contributor.driveLink;
      req.flash(
        "success",
        "🎉 Drive link received! Please check your inbox (or spam folder) for our acknowledgment email."
      );


    } else {
      req.flash("error", "⚠️ No file or drive link detected! Please try again.");
      return res.redirect("/home");
    }
    const newContributor = new Contributor(contributor);
    newContributor.status = "pending";
    newContributor.file = fileUrl;

    await newContributor.save();

    const approveLink = `${"http://localhost:8080"}/home/approve/${newContributor._id}`;
    const rejectLink = `${"http://localhost:8080"}/home/reject/${newContributor._id}`;

    await sendApproval(newContributor, approveLink, rejectLink, process.env.ADMIN_EMAIL, res);
    await receivedMessage(fileUrl, newContributor.email, newContributor.username, res);

    res.redirect("/home");
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports.rejection=async(req,res)=>{
    try{
        const user = req.user;
        if (!user) {
            req.flash("error", "⚠️ Please log in first to perform this action.");
            return res.redirect("/user/auth");
        }
        if (user.email !== (process.env.ADMIN_EMAIL)) {
            req.flash("error", "🚫 You are not authorized to reject files.");
            return res.redirect("/home");
        }
        const id=req.params.id;
        const newContributor=await Contributor.findById(id);
        if (!newContributor) {
        req.flash("error", "Contributor not found!");
        return res.redirect("/home");
        }
        if(newContributor.status==="pending"){
            newContributor.status="rejected";
            await newContributor.save();
            await rejectionMessage(newContributor.file,newContributor.email,newContributor.username,res);
            req.flash("success","File is rejected")
        }
        else{
            req.flash("error","File is already approved or rejected");
        }
        res.redirect("/home");
    }
    catch(err){
        console.error(err);
        req.flash("error", "Something went wrong while rejecting the file!");
        res.redirect("/home");
    }
};

module.exports.acceptance=async(req,res)=>{
    const user = req.user;
    if (!user) {
        req.flash("error", "⚠️ Please log in first to perform this action.");
        return res.redirect("/user/auth");
    }
    if (user.email !== (process.env.ADMIN_EMAIL)) {
        req.flash("error", "🚫 You are not authorized to accept files.");
        return res.redirect("/home");
    }
    const id=req.params.id;
    const newContributor=await Contributor.findById(id);
    if (!newContributor) {
        req.flash("error", "Contributor not found!");
        return res.redirect("/home");
    }
    console.log(newContributor);
    if(newContributor.status==="pending"){
        try {
            if(newContributor.type==="DSA_Notes"){
                console.log("Note");
                console.log(newContributor);
                let newUnit=new Unit({
                        title:newContributor.title,
                        parent:newContributor.type,
                        file:newContributor.file,
                        contributor:newContributor,
                    });
                console.log(newUnit);
                await newUnit.save();
            }
            if(newContributor.type==="Book"){
                console.log("Book");
                let oldBook=await Book.findOne({semester:newContributor.semester});
                if(oldBook===null){
                    oldBook=new Book({
                        semester:newContributor.semester,
                    });
                }
                const newUnit=new Unit({
                    title:newContributor.title,
                    file:newContributor.file,
                    contributor:newContributor,
                });
                console.log(oldBook);
                oldBook.subjects.push(newUnit);
                await newUnit.save();
                await oldBook.save();
                console.log(oldBook);
                console.log(newUnit);
            }
            if(newContributor.type==="Practical"){
                console.log("Practical");
                let oldPractical=await Practical.findOne({semester:newContributor.semester});
                console.log(oldPractical);
                if(oldPractical===null){
                    oldPractical=new Practical({
                        semester:newContributor.semester, 
                    });
                }
                const newUnit=new Unit({
                    title:newContributor.title,
                    file:newContributor.file,
                    contributor:newContributor,
                });
                
                oldPractical.subjects.push(newUnit);
                newUnit.save();
                oldPractical.save();
                console.log(oldPractical);
                console.log(newUnit);
            }
            if(newContributor.type==="PYQ"){
                console.log("PYQ");
                let oldPyq=await Pyq.findOne({semester:newContributor.semester});
                if(oldPyq===null){
                    oldPyq=new Pyq({
                        semester:newContributor.semester,
                    });
                }
                const newUnit=new Unit({
                    title:newContributor.title,
                    file:newContributor.file,
                    contributor:newContributor,
                });
                console.log(oldPyq);
                oldPyq.subjects.push(newUnit);
                newUnit.save();
                oldPyq.save();
                console.log(oldPyq);
                console.log(newUnit);
            }
            if(newContributor.type==="Note"){
                console.log("Note");
                console.log(newContributor);
                let oldNote=await Note.findOne({semester:newContributor.semester});
                if(oldNote===null){
                    oldNote=new Note({
                        semester:newContributor.semester,
                    });
                }
                const newUnit=new Unit({
                    title:newContributor.title,
                    parent:newContributor.subject,
                    file:newContributor.file,
                    contributor:newContributor,
                });
                console.log(oldNote);
                let semester;
                if(newContributor.semester==="SEM-1"){
                    semester="SEM1";
                }
                if(newContributor.semester==="SEM-2"){
                    semester="SEM2";
                }
                if(newContributor.semester==="SEM-3"){
                    semester="SEM3";
                }
                if(newContributor.semester==="SEM-4"){
                    semester="SEM4";
                }
                let oldSubject=await Subject.findOne({title:newContributor.subject});
                console.log("Subject"+oldSubject);
                let flag=false;
                if(oldSubject===null){
                    flag=true;
                    oldSubject=new Subject({
                        name:newContributor.subject,
                        title:newContributor.subject,
                        parent:newContributor.semester,
                    })
                }
                console.log(oldSubject);
                newUnit.save();
                oldSubject.units.push(newUnit);
                oldSubject.save();
                if(flag){
                    oldNote.subjects.push(oldSubject);
                }
                oldNote.save();
                console.log("Subject: "+oldSubject);
                console.log("Unit: "+newUnit);
                console.log("Note: "+oldNote);
            }
            newContributor.status="accepted";
            await newContributor.save();
            await acceptanceMessage(newContributor.file,newContributor.email,newContributor.username,res);
            req.flash("success","File is approved");
            
        } catch (error) {
            return next(error);
        }
    }
    else{
        req.flash("error","File is already rejected or approved");
    }
    res.redirect("/home");
}