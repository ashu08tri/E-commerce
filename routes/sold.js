const express = require('express');
const router = express.Router();
const Product = require('../model/schema');
const Kart  = require('../model/cart');
const{isSeller} = require('../middleware');
let sold = [];

router.get('/cart',async(req,res)=>{
    const cart = await Kart.find()
    const product = await Product.find()
    res.render('cartPage',{cart,product});
})

router.put('/cart',async(req,res)=>{
    const qty = await Kart.findByIdAndUpdate(req.body._id,req.body);
    await qty.save()
    res.redirect(`/cart`);
})

router.delete('/cart',async(req,res)=>{
    await Kart.findByIdAndDelete(req.body._id)
    res.redirect('/cart') 
})

router.get('/cart/placeOrder',async(req,res)=>{
    const cart = await Kart.find();
    sold.push(...cart)
    await Kart.deleteMany({})
    req.flash('success','Thank You, Your Order Will Be Delivered Soon.')
    res.redirect('/home');
})

router.put('/cart/product/stock',async(req,res)=>{
    const product = await Product.findByIdAndUpdate(req.body._id,req.body);
    await product.save()
    res.redirect('/cart')
})

router.get('/seller',isSeller,async(req,res)=>{
    const products = await Product.find();
    const soldItem = sold;
    res.render('seller',{products,soldItem});
}) 

router.get('/home/Order_Placed',(req,res)=>{
    res.render('placeOrder');
})

router.put('/product/:id',async(req,res)=>{
    const qty = await Product.findByIdAndUpdate(req.params.id,req.body);
    await qty.save()
    res.redirect(`/product/${qty._id}`);
})

router.get('/home/:id/checkout',async(req,res)=>{
    const checkOut = await Product.findById(req.params.id);
    res.render('checkOut',{checkOut});
})

router.put('/home/:id/checkout',async(req,res)=>{
    const qty = await Product.findByIdAndUpdate(req.params.id,req.body);
    await qty.save()
    res.redirect(`/home/${qty._id}/checkout`);
})

router.put('/home/:id/placeorder',async(req,res)=>{
    const placeOrder = await Product.findByIdAndUpdate(req.params.id,req.body);
    placeOrder.save();
    sold.push(placeOrder);
    res.redirect('/home/Order_placed');
})

router.post('/home/:id/cart',async(req,res)=>{
    const cartItem = await Product.findById(req.params.id);
    const kart = new Kart({name:cartItem.name,price:cartItem.price,qty:cartItem.qty,image:cartItem.image,stock:cartItem.stock})
    await kart.save()
    req.flash('success','Item Added');
    res.redirect(`/product/${cartItem._id}`);
})

module.exports = router;