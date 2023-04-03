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