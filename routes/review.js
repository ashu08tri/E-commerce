const express = require('express');
const router = express.Router();
const Product = require('../model/schema');
const review = require('../model/review');
const{isloggedIn,isReviewAuthor,validateReview} = require('../middleware');

router.post('/product/:id/review',isloggedIn,validateReview,async(req,res)=>{
    const products = await Product.findById(req.params.id);
    const reviews = new review(req.body);
    reviews.user = req.user._id;
    products.review.push(reviews);
    await reviews.save();
    await products.save();
    res.redirect(`/product/${products._id}`)
})

router.delete('/product/:id/review/:reviewId',isReviewAuthor,(async(req,res)=>{
    const {id,reviewId} = req.params;
    await Product.findByIdAndUpdate(id,{$pull:{review : reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/product/${id}`);
}));

module.exports = router;