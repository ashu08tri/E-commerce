const Product = require('./model/schema')
const review = require('./model/review');
const{productSchema,reviewSchema} = require('./joiSchema');
const expressError = require('./errorHandler/expressError');


module.exports.isSeller = (req,res,next)=>{
    if(!req.isAuthenticated() || req.user.role !== 'seller'){
        req.flash('error','Not Allowed')
        return res.redirect('/home')
    }
    next();
}

module.exports.isloggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error','Sign In First')
        return res.redirect('/user/login');
    }
    next();
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const products = await Product.findById(id);
    if(!products.user.equals(req.user._id)){
        req.flash('error','You are not an authorized user')
        return res.redirect(`/product/${id}`)
    }
    next();
}

module.exports.validateProduct = (req,res,next) => {
    const {error} = productSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg,400)
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const {id,reviewId} = req.params;
    const reviews = await review.findById(reviewId);
    if(!reviews.user.equals(req.user._id)){
        req.flash('error','You are not an authorized user')
        return res.redirect(`/product/${id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg,400)
    }else{
        next();
    }
} 