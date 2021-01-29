const express = require('express');
const mongoose = require('mongoose');
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GooleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./config/Keys');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
// Configurações
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(process.env.SECRET));
app.use(session(
    {
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:false
    }
));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next)=>{
    // clonar o helpers utiliza ...helpers
    res.locals.h = {...helpers};
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;

    if(req.isAuthenticated())
    { // filtrar menu para guest ou logged
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.logged);
    }
    else
    { // filtrar menu para guest  
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.guest);
    }

    if(req.isAuthenticated()){
        if(req.user.status == 'Desativado'){
            req.flash('error', 'Ops! Você não tem permissão para acessar esta página!');
            req.logout();
            res.redirect('/users/login');
        }
    }

    if(req.isAuthenticated()  && req.user.eAdmin == 1 )
    { // filtrar menu para guest ou logged
        res.locals.h.menuAdmin = res.locals.h.menuAdmin.filter(i=>i.logged);
    }
    else
    { // filtrar menu para guest  
        res.locals.h.menuAdmin = res.locals.h.menuAdmin.filter(i=>i.guest);
    }
    next();
});

// Model User, para login e registro
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user,done)=>{
    done(null,user.id)
});
passport.deserializeUser((id,done)=>
{
    User.findById(id).then((user)=>
    {
        done(null,user)
    })
});
passport.use(new GooleStrategy
(   
    {
        clientID:"576585942021-g5745o3t58r04k9ef7orbj41to0auo9m.apps.googleusercontent.com",
        clientSecret:"siqxNqft63eucXsZQV3rNYZg",
        callbackURL:"/auth/google/callback",
        proxy:true,
    },
    (accessToken, refreshToken, profile,done)=>
    {
     User.findOne({userId:profile.id})
     .then((existingUser)=>
     {
        if(existingUser)
        {
            done(null,existingUser)
        }
        else
        {
            new User(
                {   
                   userId:profile.id,
                   username:profile.displayName,
                   email:profile._json.email,
                   eAdmin:'0',
                   status:'Ativo',
                   phone:'',
                   zipCode:''
                
                }).save().then((user)=>
               {
                   done(null,user)
                })
            }
        })
    }
    
));
passport.use(new FacebookStrategy
(
    {
        clientID: "445481326459499",
        clientSecret: "8adc2d9d150bcd430d95a41ad8fa2d36",
        callbackURL: "/auth/facebook/callback",
        profileFields:['id', 'emails', 'displayName'],
        proxy:true,
    },
    (accessToken, refreshToken,profileFields,done)=>
    {  
        User.findOne({userId:profileFields.id})
        .then((existingUser)=>
        {
            if(existingUser)
            {
                done(null,existingUser)
            }
            else
            {
                new User(                
                {   
                    userId:profileFields.id,
                    username:profileFields.displayName,
                    email:profileFields._json.email,
                    eAdmin:'0',
                    status:'Ativo',
                    phone:'',
                    zipCode:''
            
                }).save().then((user)=>
                {
                    done(null,user)
                })
             }
        })

    }
));
app.use('/', router);
app.use(errorHandler.notFound);
app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');
module.exports = app;