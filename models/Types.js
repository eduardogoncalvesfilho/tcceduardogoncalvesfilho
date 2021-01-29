const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const typesSchema =  new mongoose.Schema(
    {   

        status:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        }
    }
);

module.exports = mongoose.model('Types', typesSchema);

