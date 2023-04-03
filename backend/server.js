if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require("path")

const uri = ""
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', (error)=>console.error(error))
db.once('open', ()=>console.log('Connected to Database'))

const userSchema = new mongoose.Schema({
    full_name: {type: String, required: true},
    street1: {type: String, required: true},
    street2: String,
    city: {type: String, required: true},
    zip: {type: String, required: true},
    state: { type: String, required: true },
    username: { type: String, required: true }
});
const userInfoSchema = new mongoose.Schema({
    username: {type: String, required: true },
    password: {type: String, required: true },
    new_user: {type: Boolean, default: true},
});
const fuelQuoteSchema = new mongoose.Schema({
    gallons: {type: Number, required: true },
    delivery_address: {type: String, required: true},
    delivery_date: {type: Date, required: true },
    price_per: {type: Number, required: true },
    total: {type: Number, required: true },
    username: {type: String, required: true },
});

let userInfo = {
    full_name: '', 
    street1: '', 
    street2: 'N/A',
    state: '',
    city: '', 
    zip: ''
};

const User = mongoose.model("User", userSchema)
const FuelQuote = mongoose.model("FuelQuote", fuelQuoteSchema)

const UserInfo = require('./models/UserInfo')
const initializePassport = require('./passport-config') 
const { join } = require('path')
const { truncateSync } = require('fs')

initializePassport(
    passport, 
    inputUsername => dbUsers.find(user => user.inputUsername === inputUsername),
    id => users.find(user => user.id === id)
)

app.use(express.static('public'));
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
app.set('view-engine', 'ejs')
app.use(express.urlencoded( { extended: false}))
app.use(flash())
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, async (req, res) => {
    const filter = { username: req.user.username }
    if(req.user.new_user){
        const update = { new_user: false }
        await UserInfo.findOneAndUpdate(filter, update)
        res.redirect('/editProfile')
    }
    else{
        await User.find(filter).then(async (info) => {
            console.log("info");
            console.log(info);
            userInfo = { 
                full_name: info[0].full_name,
                street1: info[0].street1,
                street2: info[0].street2,
                state: info[0].state,
                city: info[0].city,
                zip: info[0].zip
            };
        })
        res.render('index.ejs', {name: req.user.username});
    }
})
app.get('/login', checknotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checknotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checknotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.get('/profile', checkAuthenticated, (req,res) => {
    res.render('profile.ejs', {full_name: userInfo.full_name, 
    street1: userInfo.street1, 
    street2: userInfo.street2,
    state: userInfo.state,
    city: userInfo.city,
    zip: userInfo.zip});
})

const users = []
app.post('/register', checknotAuthenticated, async (req, res) => {
    try{
      const hashedPassword = await bcrypt.hash(req.body.inputPassword, 10 )
      users.push({
          id: Date.now().toString(),
          inputUsername: req.body.inputUsername,
          inputPassword: hashedPassword
      })
    await UserInfo.find({ username: req.body.inputUsername }).then((users) =>{
        if (users.length > 0){
            // console.log(users.length);
            //users.splice(0, users.length);
            res.redirect('/register');
        } else{
            const userInfo = new UserInfo ({
                username: req.body.inputUsername,
                password: hashedPassword,
                new_user: true
            })
            userInfo.save();
            console.log(userInfo);
            res.redirect('/login')
        }
    })
    } catch{
      res.redirect('/register')
    }
})


app.get('/editProfile', checkAuthenticated, (req, res) => {
    res.render('editProfile.ejs');
})

app.post('/editProfile', checkAuthenticated, async (req,res) => {
    //console.log(req.body);
    userInfo = req.body;
    const filter = { username: req.user.username };
    const user = await User.updateOne(filter, {
        full_name: userInfo.full_name, 
        street1 : userInfo.street1, 
        street2 : userInfo.street2, 
        state: userInfo.state,
        city: userInfo.city, 
        zip: userInfo.zip,
        username: req.user.username
    }, { upsert: true });
    await User.find(filter).then(async (info) => {
        //console.log("info");
        //console.log(info);
        userInfo = { 
            full_name: info[0].full_name,
            street1: info[0].street1,
            street2: info[0].street2,
            state: info[0].state,
            city: info[0].city,
            zip: info[0].zip
        };
    })
    //console.log(userInfo);
    res.redirect('/profile');
})
app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

const PORT = process.env.PORT || 3000;
module.exports = {
    checkAuth: function(){
        return checkAuthenticated;
    },
    checkHist: function(){
        return hist;
    },
    checkUsername: function(){
        return users.inputUsername;
    },
    checkPassword: function(){
        return users.inputPassword;
    },
    user: function() {
        return userInfo;
    },
    
    fuel_quote: function() {
        return Fuel_quote;
    },
    server: app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}