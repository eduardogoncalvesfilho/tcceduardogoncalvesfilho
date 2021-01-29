const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//const ObjectId = mongoose.SchemaTypes.ObjectId;
const categorysSchema =  new mongoose.Schema(
    {   
        type:{
            type:String,
            required:true
        },
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

module.exports = mongoose.model('Categorys', categorysSchema);

