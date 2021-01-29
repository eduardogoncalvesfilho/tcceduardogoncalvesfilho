const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    username:String,
    eAdmin:String,
    email:String,
    status:String,
    phone:String,
    userId: String,
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    zipCode:{
        type:String,
        trim: true
    },
    street:{
        type:String,
        trim: true
    },
    number:{
        type:String,
        trim: true
    },

    neighb:{
        type:String,
        trim: true
    },
    city:{
        type:String,
        trim: true
    },
    state:{
        type:String,
        trim: true
    },
    complement:{
        type:String,
        trim: true
    },
    referencePoint:{
        type:String,
        trim: true
    }
});

userSchema.plugin(passportLocalMongoose, { usernameField:'email' });

module.exports = mongoose.model('User', userSchema);