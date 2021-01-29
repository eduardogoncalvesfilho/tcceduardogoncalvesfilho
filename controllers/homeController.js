const mongoose = require('mongoose');
const { post } = require('../app');
const Ads = mongoose.model('Ads');
exports.index = async(req, res)=>
{
    let responseJson = 
    {
        ads:[],
        category:[],
        tag:''
    };
    responseJson.tag = req.query.t;
    const adFilter = (typeof responseJson.tag != 'undefined') ? {status: 'Publicado',category:responseJson.tag}:{status: 'Publicado'};
    const categoryPromise =  Ads.getCategoryList();
    const adsPromise =  Ads.find(adFilter);
    const [category, ads] = await Promise.all([categoryPromise, adsPromise]);
    for(let i in category)
    {
        if(category[i]._id == responseJson.tag)
        {
            category[i].class = "selected";
        }
    }
    responseJson.category = category;
    responseJson.ads = ads;
    res.render('home', responseJson);  
};

  