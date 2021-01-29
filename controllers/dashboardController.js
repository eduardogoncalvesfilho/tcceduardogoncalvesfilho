const mongoose = require('mongoose');
const { post } = require('../app');
const Ads = mongoose.model('Ads');
const User = require( '../models/User' );
const fs = require('fs');
const moment = require('moment');
const { resolve } = require('path');
exports.dashboard = async(req, res)=>
{

  let responseJson =   {};
  const countUsersPromise =  User.find().countDocuments();
  const countAdsPromise =  Ads.find().countDocuments();
  const countAdsActivePromise = Ads.find({status:'Publicado'}).countDocuments();
  const countAdsDisabledPromise = Ads.find({status:'Pausado'}).countDocuments();
  const statusPromise =  Ads.countstatus();
  const createdAtPromise =  Ads.getDateList();
  
  const [countUsers,countAds,countAdsActive,countAdsDisabled,datas,status] = await Promise.all([countUsersPromise,countAdsPromise,countAdsActivePromise,countAdsDisabledPromise,createdAtPromise,statusPromise]);

  responseJson.countUsers = countUsers; 
  responseJson.countAds = countAds; 
  responseJson.countAdsActive = countAdsActive; 
  responseJson.countAdsDisabled = countAdsDisabled; 
  responseJson.datas = datas;
  responseJson.status = status;

  res.render('dashboard',responseJson);
    
};

exports.graphicajax = async(req, res)=>
{
  const datePromise =  Ads.countAds();
  const [dates] = await Promise.all([datePromise]);
  for(let i in dates){
    dates[i]._id = moment(dates[i]._id).format('DD/MM/YYYY');
  }
  let date = [];
  let count = [];
  dates.forEach(row=>{
    date.push(row._id);
    count.push(row.count);
  });
  
  
  let responseJson =  {
    date,
    count
  };

  res.json(responseJson);
};
exports.graphicastatusjax = async(req, res)=>
{
  const statusPromise =  Ads.countstatus();
  const [status] = await Promise.all([statusPromise]);
 
  let statu = [];
  let count = [];
  status.forEach(row=>{
    statu.push(row._id);
    count.push(row.count);
  });
  
  
  let responseJson =  {
    statu,
    count
  };
  

  res.json(responseJson);
};

exports.pauseAction = async (req, res) => {
      
    await Ads.findOne({ _id: req.params._id }, async(error, result) => {
    if(`${result._id}` == `${req.params._id}`){  

      Ads.findOneAndUpdate({ _id:result._id },{status:"Pausado"}, async(error, result) =>{
        if (error) throw error;
        req.flash('success', 'Anúncio pausado com sucesso!');
        return res.redirect('/anuncios');
      }); 
     }else{
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/anuncios');
     }
   });
};
  exports.startingAction = async (req, res) => {
      
  await Ads.findOne({ _id: req.params._id }, async(error, result) => {
    if(`${result._id}` == `${req.params._id}`){   


    Ads.findOneAndUpdate({ _id:result._id },{status:"Publicado"}, async(error, result) =>{
      if (error) throw error;
      req.flash('success', 'Anúncio despausado com sucesso!');
      return res.redirect('/anuncios');
    }); 
   }else{
    req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
    return res.redirect('/anuncios');
   }
 });
};

exports.deleteAction = async (req, res,) => {
    // 1. Pegar as informações do anúncio em questão
    await Ads.findOne({ _id: req.params._id }, async(error, result) => {
    if(`${result._id}` == `${req.params._id}`){   
              // Deletando o arquivo da pasta local
             // O fs.acess serve para testar se o arquivo realmente existe, evitando bugs
             result.photos.forEach(element => {
              fs.access(`./public/media/${element}`, (err) => {
                // Um erro significa que a o arquivo não existe, então não tentamos apagar
                if (!err) {  
                    //Se não houve erros, tentamos apagar
                    fs.unlink(`./public/media/${element}`, err => {
                        if(err) throw err;
                    })
                }
            });
            });
      await Ads.deleteOne({_id: result._id}, (error, result) =>{
        if (!error) {
          req.flash('success', 'Anúncio deletado com sucesso!');
          return res.redirect('/anuncios');
        }else{
          req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
          return res.redirect('/anuncios');
        }
      });
   
   }else{
    req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
    return res.redirect('/anuncios');
  }  
  });
  };  
  exports.viewuser = async (req, res)=>{
    const user = await User.findOne({ _id: req.params._id });
    res.render('viewuser', { user: user });
};