const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
//login middleware
  // post login page
module.exports.isLoggedIn = (req, res, next) => {

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in to do that!");
      return res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id); 
  if (!listing.owner.equals(res.locals.currUser._id)) {
    console.log('User is not the owner'); // Debug statement
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
  } else {
      next();
  }
};

module.exports.validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  
  if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }else{
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
      let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId);

      if (!review) {
          req.flash("error", "Review not found");
          return res.redirect(`/listings/${id}`);
      }

      if (!res.locals.currUser || !res.locals.currUser._id) {
          req.flash("error", "You must be logged in to do that!");
          return res.redirect("/login");
      }

      if (!review.author || !review.author.equals(res.locals.currUser._id)) {
          req.flash("error", "You are not the author of this review");
          return res.redirect(`/listings/${id}`);
      }

      next();
  } catch (error) {
      console.error("Error in isReviewAuthor middleware:", error);
      req.flash("error", "Something went wrong!");
      res.redirect("back");
  }
};
