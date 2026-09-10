const Review = require("../models/reviews");

module.exports.reviewListing=async(req,res)=>{
    const reviews = await Review.find().sort({ createdAt: -1 });
    try{
    res.render("reviews.ejs", { 
      reviews: reviews,
      ...res.locals.user 
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    req.flash("error", "Failed to load reviews");
    res.redirect("/home");
  }
};
module.exports.reviewForm=async(req,res)=>{
    try {
    if (!req.user) {
      req.flash("error", "You must be logged in");
      return res.redirect("/user/auth");
    }

    const { review } = req.body;

    if (!review || !review.rating || !review.comment) {
      req.flash("error", "Please fill in all fields");
      return res.redirect("/reviews");
    }

    const rating = parseInt(review.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      req.flash("error", "Rating must be 1-5");
      return res.redirect("/reviews");
    }

    const newReview = new Review({
      username: req.user.name,
      userId: req.user._id,
      rating: rating,
      comment: review.comment,
      createdAt: new Date()
    });

    await newReview.save();  

    req.flash("success", "Review posted successfully 👍");
    res.redirect("/reviews");

  } catch (error) {
    console.error("Error:", error);
    req.flash("error", "Failed to post review");
    res.redirect("/reviews");
  }
};
module.exports.reviewDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      req.flash("error", "Review not found");
      return res.redirect("/reviews");
    }
    req.flash("success", "Review deleted successfully");
    res.redirect("/reviews");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong");
    res.redirect("/reviews");
  }
};


