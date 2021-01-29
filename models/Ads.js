const mongoose = require('mongoose');
const slug = require('slug');
const moment = require('moment');

mongoose.Promise = global.Promise;

// Pegar o Id do usuario para relacionar ao anúncio criado
const ObjectId = mongoose.SchemaTypes.ObjectId;


//Anúncio
const adsSchema =  new mongoose.Schema(
    {
        type:{
            type:String,
            required:true
        },
        rentAndSale:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        photos:{
            type:Object,
            required:true
        },
        title:{
            type:String,
            trim: true,
            required:'O anúcio precisa de um título!'
        },
        slug:{
            type:String,
            trim:true
        },
        description:{
            type:String,
            trim: true,
            required:true
        },
        immobiles:{
            type:Object,
            required:true
        },
        status:{
            type:Object,
            required:true
        },
        author:{
            type:Object,
            required:true
        },
        codeRef:{
            type:Number
        },
        createdAt: {
            type: Date
        }
    }
    
);
// Cadastro do Slug do anúncio
adsSchema.pre('save', async function(next)
{
    if(this.isModified('title'))
    {
        this.slug = slug(this.title, {lower:true});
        const slugRegex = new RegExp(`^( ${ this.slug } )( ( -[0-9]{1,}$ ) ? )$`, 'i' );
        const adWithSlug = await this.constructor.find( { slug:slugRegex } );

        
        if(adWithSlug.length > 0)
        {
            this.slug = `${ this.slug }-${ adWithSlug.length + 1 }`;

        }
    }
    next();
});

adsSchema.statics.getDateList = function(filters = {})
{
    return this.aggregate(
        [    { $match:filters },
            { $unwind:'$_id' },
            { $group:{ _id:'$createdAt', count:{ $sum:1 } } },
            { $sort:{ count:-1 } }
          
            
        ]
    );
}
adsSchema.statics.findAds = function(filters = {})
{
    return this.aggregate(
        [
            { $match:filters },
            { $lookup:
                {
                    from: 'immobiles',
                    localField: 'immobileId',
                    foreignField: '_id',
                    as: 'immobile'
                }
            },
            { $addFields:
                {
                    'immobile':{ $arrayElemAt:[ '$immobile', 0 ]  }
                } 
            }
        ]);
}
adsSchema.statics.getCategoryList = function(filters = {})
{   
    return this.aggregate(
        [   
            { $match:filters},
            { $unwind:'$category' },
            { $group:{ _id:'$category', count:{ $sum:1 }} },
            { $sort:{ count:-1 } }
        ]
    );

}
adsSchema.statics.getStateList = function(filters = {})
{   
    return this.aggregate(
        [   
            { $match:filters},
            { $unwind:'$state' },
            { $group:{ _id:'$state', count:{ $sum:1 }} },
            { $sort:{ count:-1 } }
        
        ]
    );

}

adsSchema.statics.countAds = function()
{   
    
    const dateAnt = moment(new Date(moment().subtract(30, 'days').calendar())).format('YYYY/MM/DD');
    const dateNow = moment(new Date()).format('YYYY/MM/DD');


    return this.aggregate([
        { 
          $match: { 
            createdAt: {$gt: new Date(dateAnt),$lte:new Date(dateNow)},
            status:'Publicado'
          } 
        },
       //,
       { $unwind:'$createdAt' },
        {
          $group: {
            _id: '$createdAt', 
            count: { $sum: 1 }
          }
        
        },{ $sort:{ _id:1}}
      ])

}

adsSchema.statics.countstatus = function()
{
    return this.aggregate(
        [
            { $unwind:'$status' },
            { $group:{ _id:'$status', count:{ $sum:1 }} },
            { $sort:{ count:-1 } }
            
        ]
    );
}

const categorysSchema =  new mongoose.Schema(
    {   
        type:String,
        status:String,
        name:String
        
    }
);
const typesSchema =  new mongoose.Schema(
    {   
       
        status:String,
        name:String
        
    }
);
module.exports = mongoose.model('Types', typesSchema);
module.exports = mongoose.model('Categorys', categorysSchema);
module.exports = mongoose.model('Ads', adsSchema);

