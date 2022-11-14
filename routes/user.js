const express = require('express');
const router = express.Router();
const user = require('../model/user');
const passport = require('passport');


router.get('/user/login',(req,res)=>{
    res.render('login');
})

router.post('/user/register',async(req,res)=>{
    try{
    const {email,username,password,role} = req.body;
    const User = new user({email,username,role});
    const newUser = await user.register(User,password);
    req.login(newUser,function(err){
        if(err) {return next(err)}
             req.flash('success','User Registered Successfully');
             res.redirect('/home');
         })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/user/login');
    }
})

router.post('/user/login',passport.authenticate('local',{failureFlash : true, failureRedirect : '/user/login'}),async(req,res)=>{
        if(req.user.role === 'seller'){
        req.flash('success','Seller Logged In');
        res.redirect('/seller');
        }else{
            req.flash('success','Customer Logged In');
            res.redirect('/home')
        }
})

router.get('/user/logout',(req,res)=>{
    req.logout();
    res.redirect('/home')
})

module.exports = router;