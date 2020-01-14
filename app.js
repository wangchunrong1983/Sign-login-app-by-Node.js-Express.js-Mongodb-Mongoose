const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')


//Passport config
//Passport config
require('./config/passport')(passport)

//DB Config
const db = require('./config/keys').MongoURI

//Connet to Mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))

//Ejs
app.use(expressLayouts)
app.set('view engine','ejs')

//Bodyparser
app.use(express.urlencoded({ extended: false}))

//Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true 
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash())

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

