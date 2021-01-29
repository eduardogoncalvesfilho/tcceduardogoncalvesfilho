const mongoose = require('mongoose');
const Ads = mongoose.model('Ads');
exports.category = async(req, res)=>
{
    let responseJson = 
    {
        ads:[],
        category:[],
        state:[]
      
    };

    
    responseJson.t = req.query.t;
   
    
    const adFilter = (typeof responseJson.t != 'undefined') ? {status: 'Publicado',category:responseJson.t}:{status: 'Publicado'};

    const categoryPromise =  Ads.getCategoryList(adFilter);
    const categorysPromise =  Ads.getCategoryList({status: 'Publicado'});
    const statePromise =  Ads.getStateList(adFilter);
    const adsPromise =  Ads.find(adFilter);
    
    const [category,categorys,state, ads] = await Promise.all([categoryPromise,categorysPromise,statePromise, adsPromise]);
    
    for(let i in category)
    {
        if(category[i]._id == responseJson.t)
        {
            category[i].class = "list-group-item-primary";
        }
    }

    for(let i in ads)
    {
        if(ads[i].rentAndSale == 'Aluguel')
        {
            ads[i].addMes = "/mês";
        }else{
            ads[i].addMes = "";
        }
        if(ads[i].immobiles.condominiumValue == '0,00')
        {  
            ads[i].class = "d-none";
        }
        else
        {
            ads[i].class = "";
        }
        if(ads[i].immobiles.iptuValue == '0,00')
        {  
            ads[i].classNone = "d-none";
        }
        else
        {
            ads[i].classNone = "";
        }
    }
  
    responseJson.category = category;
    responseJson.categorys = categorys;
    responseJson.state = state;
    responseJson.ads = ads;
   
    res.render('category', responseJson);
    
};
exports.state = async(req, res)=>
{
    let responseJson = 
    {
        ads:[],
        category:[],
        state:[],
        tag:''
    };

    
    responseJson.tag = req.query.t;

    
    const adFilter = (typeof responseJson.tag != 'undefined') ? {status: 'Publicado',state:responseJson.tag}:{status: 'Publicado'};

    const categoryPromise =  Ads.getCategoryList(adFilter);
    const categorysPromise =  Ads.getCategoryList({status: 'Publicado'});
    const statePromise =  Ads.getStateList(adFilter);
    const adsPromise =  Ads.find(adFilter);
    
    const [category,categorys,state, ads] = await Promise.all([categoryPromise,categorysPromise,statePromise, adsPromise]);
    
    for(let i in state)
    {
        if(state[i]._id == responseJson.tag)
        {
            state[i].class = "list-group-item-primary";
        }
    }
    for(let i in ads)
    {
        if(ads[i].rentAndSale == 'Aluguel')
        {
            ads[i].addMes = "/mês";
        }else{
            ads[i].addMes = "";
        }
        if(ads[i].immobiles.condominiumValue == '0,00')
        {  
            ads[i].class = "d-none";
        }
        else
        {
            ads[i].class = "";
        }
        if(ads[i].immobiles.iptuValue == '0,00')
        {  
            ads[i].classNone = "d-none";
        }
        else
        {
            ads[i].classNone = "";
        }
    }

    if(ads == ''){
        ads.classNoneAds = 'd-none';
        ads.classblockAds = 'd-block';
    }else{
        ads.classblockAds = 'd-none';
        ads.classNoneAds = 'd-block';
    }
    responseJson.category = category;
    responseJson.categorys = categorys;
    
    responseJson.state = state;
    responseJson.ads = ads;
    res.render('state', responseJson);
    
};
exports.search = async(req, res)=>
{
    let responseJson = 
    {
        ads:[],
        category:[],
        state:[],
        rentAndSale:[],
        typeImmobile:[]
    };


    responseJson.tag = req.query.t;
    responseJson.rentAndSale = req.body.rentAndSale;
    responseJson.typeImmobile = req.body.typeImmobile;
    responseJson.state = req.body.state;
    
    if(responseJson.typeImmobile != ''){
        var adFilter = (responseJson.typeImmobile != '') ? {status: 'Publicado',category:responseJson.typeImmobile,rentAndSale:responseJson.rentAndSale}:{};
    }else{
        var adFilter = (responseJson.typeImmobile == '') ? {status: 'Publicado',rentAndSale:responseJson.rentAndSale}:{};
    }

    


    const categoryPromise =  Ads.getCategoryList(adFilter);
    const statePromise =  Ads.getStateList(adFilter);
    const categorysPromise =  Ads.getCategoryList({status: 'Publicado'});
    const adsPromise =  Ads.find(adFilter);
   
    const [category,categorys,state, ads] = await Promise.all([categoryPromise,categorysPromise,statePromise, adsPromise]);
   
    for(let i in category)
    {
        if(category[i]._id == responseJson.tag)
        {
            category[i].class = "list-group-item-primary";
        }
    }
    for(let i in state)
    {
        if(state[i]._id == responseJson.state)
        {
            state[i].class = "list-group-item-primary";
        }
    }
    for(let i in ads)
    {
        if(ads[i].rentAndSale == 'Aluguel')
        {
            ads[i].addMes = "/mês";
        }else{
            ads[i].addMes = "";
        }
        if(ads[i].immobiles.condominiumValue == '0,00')
        {  
            ads[i].class = "d-none";
        }
        else
        {
            ads[i].class = "";
        }
        if(ads[i].immobiles.iptuValue == '0,00')
        {  
            ads[i].classNone = "d-none";
        }
        else
        {
            ads[i].classNone = "";
        }
    }

    if(ads == ''){
        ads.classNoneAds = 'd-none';
        ads.classblockAds = 'd-block';
    }else{
        ads.classblockAds = 'd-none';
        ads.classNoneAds = 'd-block';
    }

    responseJson.category = category;
    responseJson.categorys = categorys;
    responseJson.state = state;
   responseJson.ads = ads;
    res.render('category', responseJson);
    
};
exports.searchTitleAction = async(req, res)=>
{
    let responseJson = 
    {
        ads:[],
        category:[],
        rentAndSale:[],
        typeImmobile:[]
     
    };



    responseJson.id = req.body.idAd;

    const adFilter = (responseJson.id != '') ? {status: 'Publicado',_id:responseJson.id}:{status: 'Publicado'};
    const categoryPromise = await Ads.getCategoryList();
    const statePromise =  Ads.getStateList();
    const adsPromise = await Ads.find(adFilter);
   
    
    
    const [category,state, ads] = await Promise.all([categoryPromise,statePromise, adsPromise]);
    
    for(let i in category)
    {
        if(category[i]._id == responseJson.tag)
        {
            category[i].class = "list-group-item-primary";
        }
    }
    for(let i in ads)
    {
        if(ads[i].rentAndSale == 'Aluguel')
        {
            ads[i].addMes = "/mês";
        }else{
            ads[i].addMes = "";
        }
        if(ads[i].immobiles.condominiumValue == '0,00')
        {  
            ads[i].class = "d-none";
        }
        else
        {
            ads[i].class = "";
        }
        if(ads[i].immobiles.iptuValue == '0,00')
        {  
            ads[i].classNone = "d-none";
        }
        else
        {
            ads[i].classNone = "";
        }
    }
    if(ads == ''){
        ads.classNoneAds = 'd-none';
        ads.classblockAds = 'd-block';
    }else{
        ads.classblockAds = 'd-none';
        ads.classNoneAds = 'd-block';
    }
    responseJson.category = category;
    responseJson.state = state;
    responseJson.ads = ads;

    res.render('searchTitle', responseJson);
    
};
exports.searchTitle = function(req, res, next){
    {
      const regex = new RegExp(req.query['term'],'i');
      Ads.find( { title: { $all: regex }, status:'Publicado'}, function(err, data){
       
        const result = [];
        if(!err){
            if(data && data.length && data.length >0){
    
                data.forEach(user=>{
                    let obj ={
                        id:user._id,    
                        label:user.title
                    };
                    result.push(obj).toString
                })
    
            }
            
           res.jsonp(result);
        }
      }).limit(10);
    }
};
