if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const Product = require('../model/schema');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
const catchAsync = require('../errorHandler/catchAsync');
const{isSeller,isloggedIn,isAuthor,validateProduct} = require('../middleware');
const Kart = require('../model/cart')

router.get('/home',catchAsync(async(req,res)=>{
    const {page=1,limit=4} = req.query
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const products = await Product.find().limit(limit).skip(startIndex).populate({path:'review',populate : {path : 'user'}});
    const count = await Product.countDocuments()
    const cart = await Kart.find()
    res.render('home',{products,cart,count,startIndex,endIndex})
}))

router.get('/home/add-product',isSeller,(req,res)=>{
    res.render('addProduct');
})

router.post('/home/add-product',isloggedIn,upload.array('image'),validateProduct,catchAsync(async(req,res)=>{
    const newProduct = new Product(req.body);
    const imgs = req.files.map(f=>({url:f.path,filename: f.filename}))
    newProduct.image.push(...imgs)
    newProduct.user = req.user._id;
    await newProduct.save();
    req.flash('success','Product Added Successfully');
    res.redirect('/home');
}))

router.get('/product/search',async(req,res)=>{
    const query = req.query;
    const search = await Product.find({name:{$regex:query.q}});
    if(query.q !== "" || query.q === search){
        res.render('searchProduct',{search})
    }else{
        res.render('NothingFound');  
    } 
})

router.get('/product/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const item = await Product.findById(id)
    .populate({path:'review',populate : {path : 'user'}});
    const cart = await Kart.find()
    res.render('show',{item,cart});
}))

router.get('/product/:id/edit',isloggedIn,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const edit = await Product.findById(id);
    res.render('edit',{edit})
}))

router.put('/product/:id/edit',isloggedIn,isAuthor,upload.array('image'),validateProduct,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const editItem = await Product.findByIdAndUpdate(id,req.body);
    const imgs = req.files.map(f => ({url : f.path,filename : f.filename}));
    editItem.image.push(...imgs);
    await editItem.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await books.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}});
    }
    res.redirect('/home');
}))

router.delete('/product/:id',isloggedIn,isAuthor,catchAsync(async(req,res)=>{
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/home');
}))

module.exports = router;