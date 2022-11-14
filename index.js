if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const user = require('./model/user');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const reviewRouter = require('./routes/review');
const soldRouter = require('./routes/sold');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const flash = require('connect-flash')
const passport = require('passport');
const localStrategy = require('passport-local');
const expressError = require('./errorHandler/expressError');
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/product';

mongoose.connect(dbUrl,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(() => console.log('connected to DB'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

const secret = process.env.SECRET || 'thisissecret'

const store = new MongoDBStore({
    url:dbUrl,
    secret,
    touchAfter:24*60*60
})

store.on('error',function(e){
    console.log('Error',e)
})
const sessionConfig = {
    store,
    name : '_nsid',
    secret,
    resave:false,
    saveUninitialized:true,
    cookies : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',productRouter)
app.use('/',userRouter)
app.use('/',reviewRouter)
app.use('/',soldRouter)
app.use(mongoSanitize());


app.all('*',(req,res,next) =>{
    next( new expressError('Page Not Found',404));
 })
 
 app.use((err,req,res,next) => {
     const{status=500} = err;
     if(!err.message) err.message = 'Something Went Wrong';
     res.status(status).render('error',{err});
 })



const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`Listening on port ${port}`));