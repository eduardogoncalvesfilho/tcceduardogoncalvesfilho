const multer = require("multer");
const sharp = require("sharp");
const fs = require('fs');
const mongoose = require('mongoose');
const Ads = mongoose.model('Ads');
const uuid = require('uuid');
const moment = require('moment');
const pdf = require('html-pdf');
const ejs = require('ejs');

const multerStorage = multer.memoryStorage();
exports.view = async (req, res)=>
{
    // 1. Pegar as informações do anúncio em questão
   await Ads.findOne({ _id: req.params._id }, (error, result) =>{
      if(!error)
        {
          moment.locale('pt');
        result.date =  moment(result.createdAt).endOf('day').fromNow();   

          if(result.rentAndSale == 'Aluguel')
          {  
            
            result.addMes = "/mês";
          }
          else
          {
            result.addMes = "";
          }
          if(result.immobiles.condominiumValue == '0,00')
          {  
            result.class = "d-none";
          }
          else
          {
            result.class = "";
          }
          if(result.immobiles.iptuValue == '0,00')
          {  
            result.classNone = "d-none";
          }
          else
          {
            result.classNone = "";
          }
        
          res.render('view', { ads: result });
        }
     
         // console.log(moment(result.createdAt).format('DD/MM/YYYY'));
          
    });
   
};
exports.generatepdf = async (req, res)=>
{
    // 1. Pegar as informações do anúncio em questão
   await Ads.findOne({ _id: req.params._id }, (error, result) =>{
      if(!error)
        {
          moment.locale('pt');
        result.date = moment(result.createdAt).format('DD/MM/YYYY');   

          if(result.rentAndSale == 'Aluguel')
          {  
            
            result.addMes = "/mês";
          }
          else
          {
            result.addMes = "";
          }
          if(result.immobiles.condominiumValue == '0,00')
          {  
            result.class = "d-none";
          }
          else
          {
            result.class = "";
          }
          if(result.immobiles.iptuValue == '0,00')
          {  
            result.classNone = "d-none";
          }
          else
          {
            result.classNone = "";
          }
       
        
          res.render('generatepdf', { ads: result });
        }
     
         // console.log(moment(result.createdAt).format('DD/MM/YYYY'));
          
    });
   
};
// upload das fotos
const multerFilter = (req, file, next) => 
{
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowed.includes(file.mimetype))
    {
        next(null, true);
    }
    else
    {
        next({message:'Arquivo não suportado'}, false);
    }
};
const upload = multer(
  {
    storage: multerStorage,
    fileFilter: multerFilter
  }
);
const uploadFiles = upload.array("images", 12);
exports.uploadImages = (req, res, next) => 
{
    uploadFiles(req, res, err => 
    {
        if (err instanceof multer.MulterError) 
        {
           if (err.code === "LIMIT_UNEXPECTED_FILE") 
           {
              return  req.flash('error', 'Muitos arquivos para enviar. Máximo permitido é de 12 fotos!');
            }
        } 
        else if (err) 
        {
              return req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
        }
        next();
    });
};
exports.resizeImages = async (req, res, next) => 
{
  if (!req.files)
  {
    return next();
  }
  req.body.images = [];
  await Promise.all(
    req.files.map(async file => 
      {
          const filename = file.mimetype.split('/')[1];
          const newFilename = `${uuid.v4()}.${filename}`;   
          await sharp(file.buffer)
          .resize(800, sharp.AUTO)
          .toFile(`./public/media/${newFilename}`);
          req.body.images.push(newFilename);
      })
  );
  next();
};
// Final upload
exports.add = (req, res) => {
  res.render('adAdd');
};
exports.addAction = async (req, res) => 
{
  if (req.body.images.length <= 0) 
  {
    return  req.flash('error', 'Selecione pelo menos uma imagem!');
  }
  const images = req.body.images.map(image => "" + image + "").join(",");
  req.body.images = [];
  req.body.adress = 
  { 
      zipCode:req.body.zipCode,
      street:req.body.street,
      number:req.body.number,
      neighb:req.body.neighb,
      city:req.body.city,
      state:req.body.state,
      complement:req.body.complement,
      referencePoint:req.body.referencePoint
  }
  req.body.photos = images.split(',');
  req.body.author = 
  {
    _id: req.user._id,
    name:req.user.username,
    email:req.user.email,
    phone:req.user.phone
  }
  req.body.title = ` ${req.body.typeImmobile} ${req.body.type}  ${req.body.neighb}  ${req.body.city} ${req.body.state}`;
  req.body.status = 'Publicado';    
  req.body.immobiles = 
  {
        adress:req.body.adress,
        usefulArea:req.body.usefulArea,
        typeImmobile:req.body.typeImmobile,
        totalArea:req.body.totalArea,
        bedrooms:req.body.bedrooms,
        bathrooms:req.body.bathrooms,
        suites:req.body.suites,
        vacancy:req.body.vacancy,
        floor:req.body.floor,
        saleValue:req.body.saleValue,
        condominiumValue:req.body.condominiumValue,
        iptuValue:req.body.iptuValue
  };


  req.body.createdAt = moment(new Date()).format('YYYY/MM/DD');
   
  req.body.codeRef = Math.floor(Math.random() * 10000000+10000000+1);

  const ads = new Ads(
  {     codeRef:req.body.codeRef,
        type:req.body.type, // Tipo do anúncio se é venda ou aluguel
        category:req.body.typeImmobile, // Tipo do imovél ex: apartamento, casa
        title:req.body.title,
        slug:req.body.slug,
        photos:req.body.photos,
        author:req.body.author,
        immobiles:req.body.immobiles,
        description:req.body.description,
        rentAndSale:req.body.rentAndSale,
        state:req.body.state,
        status:req.body.status,
        createdAt:req.body.createdAt
  });
  try
  {
    await ads.save();
  } 
  catch (error) 
  {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/anuncia');
  } 
  req.flash('success', 'Anúncio publicado com sucesso!');
  res.redirect('/meusanuncios');
};
exports.deleteAction = async (req, res,) => 
{
  // 1. Pegar as informações do anúncio em questão
  await Ads.findOne({ _id: req.params._id }, async(error, result) => 
  {
    if(`${result.author._id}`== `${req.user._id}`)
    {  
      // Deletando o arquivo da pasta local
      // O fs.acess serve para testar se o arquivo realmente existe, evitando bugs
      result.photos.forEach(element => 
      {
          fs.access(`./public/media/${element}`, (err) => 
          {
            // Um erro significa que a o arquivo não existe, então não tentamos apagar
            if (!err) 
            {  
              //Se não houve erros, tentamos apagar
              fs.unlink(`./public/media/${element}`, err => 
              {
                if(err) throw err;
              });
          }
        });
      });
        await Ads.deleteOne({_id: result._id}, (error, result) =>
        {
          if (!error) 
          {
            req.flash('success', 'Anúncio deletado com sucesso!');
            return res.redirect('/meusanuncios');
          }
          else
          {
            req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
            return res.redirect('/meusanuncios');
          }
        });
    }
    else
    {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/meusanuncios');
    } 
  });
};
exports.edit = async (req, res,) => 
{
  await Ads.findOne({ _id: req.params._id }, (error, result) => 
  {
    if(`${result.author._id}` == `${req.user._id}`)
    {
    // Class Style auxiliar
      if(`${result.rentAndSale}`  == 'Aluguel')
      {
        result.classactiveOn = "";
        result.classactiveOff = "active";
        result.classcheckedOn = "checked";
        result.classcheckedOff = "";
      }
      else if(`${result.rentAndSale}` == 'Venda')
      {
        result.classactiveOn = "active";
        result.classactiveOff = "";
        result.classcheckedOff = "checked";
        result.classcheckedOn = "";
      }
      if(`${result.type}`  == 'Comercial')
      {
        result.classactiveTypeOn = "";
        result.classactiveTypeOff = "active";
        result.classcheckedTypeOn = "checked";
        result.classcheckedTypeOff = "";
      }
      else if(`${result.type}` == 'Residencial')
      {
        result.classactiveTypeOn = "active";
        result.classactiveTypeOff = "";
        result.classcheckedTypeOff = "checked";
        result.classcheckedTypeOn = "";
      }

      if(`${result.immobiles.adress.state}` == 'AC')
      {
        result.selectedstateac = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'AL')
      {
        result.selectedstateal = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'AP')
      {
        result.selectedstateap = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'AM')
      {
        result.selectedstateam = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'BA')
      {
        result.selectedstateba = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'CE')
      {
        result.selectedstatece = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'DF')
      {
        result.selectedstatedf = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'ES')
      {
        result.selectedstatees = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'GO')
      {
        result.selectedstatego = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'MA')
      {
        result.selectedstatema = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'MT')
      {
        result.selectedstatemt = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'MS')
      {
        result.selectedstatems = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'MG')
      {
        result.selectedstatemg = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'PA')
      {
        result.selectedstatepa = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'PB')
      {
        result.selectedstatepb = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'PR')
      {
        result.selectedstatepr = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'PE')
      {
        result.selectedstatepe = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'PI')
      {
        result.selectedstatepi = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'RJ')
      {
        result.selectedstaterj = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'RN')
      {
        result.selectedstatern = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'RS')
      {
        result.selectedstaters = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'RO')
      {
        result.selectedstatero = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'RR')
      {
        result.selectedstaterr = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'SC')
      {
        result.selectedstatesc = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'SP')
      {
        result.selectedstatesp = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'SE')
      {
        result.selectedstatese = "selected";
      }
      else if(`${result.immobiles.adress.state}` == 'TO')
      {
        result.selectedstateto = "selected";
      }


      return res.render('adEdit', {ad:result});
    }
    else
    {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('meusanuncios');
    }
  });
};
exports.editAction = async (req, res,) => 
{
  // 1. Pegar as informações do anúncio em questão
  await Ads.findOne({ _id: req.params._id }, async(error, result) => 
  {
    if(`${result.author._id}`== `${req.user._id}`)
    {  
      if(req.body.images.length > 0)
      {
        result.photos.forEach(element => 
          {
            fs.access(`./public/media/${element}`, (err) => 
            {
              // Um erro significa que a o arquivo não existe, então não tentamos apagar
              if (!err) 
              {  
                //Se não houve erros, tentamos apagar
                fs.unlink(`./public/media/${element}`, err => 
                {
                          if(err) throw err;
                })
              }
                  
            });
            
          });
          if (req.body.images.length <= 0) 
          {
            return  req.flash('error', 'Selecione pelo menos uma imagem!');
          }
          const images = req.body.images.map(image => "" + image + "").join(",");
          req.body.images = [];
          req.body.photos = images.split(',');
      }
          req.body.adress = 
          { 
              zipCode:req.body.zipCode,
              street:req.body.street,
              number:req.body.number,
              neighb:req.body.neighb,
              city:req.body.city,
              state:req.body.state,
              complement:req.body.complement,
              referencePoint:req.body.referencePoint
          }
          req.body.author = 
          {
            _id: req.user._id,
            name:req.user.username,
            email:req.user.email,
            phone:req.user.phone
          }
          req.body.title = ` ${req.body.typeImmobile} ${req.body.type}  ${req.body.neighb}  ${req.body.city} ${req.body.state}`;
          req.body.status = 'Publicado';    
          req.body.immobiles = 
          {
                adress:req.body.adress,
                usefulArea:req.body.usefulArea,
                typeImmobile:req.body.typeImmobile,
                totalArea:req.body.totalArea,
                bedrooms:req.body.bedrooms,
                bathrooms:req.body.bathrooms,
                suites:req.body.suites,
                vacancy:req.body.vacancy,
                floor:req.body.floor,
                saleValue:req.body.saleValue,
                condominiumValue:req.body.condominiumValue,
                iptuValue:req.body.iptuValue
          };
          req.body.slug = require('slug')(req.body.title, { lower: true });     
          await Ads.findOneAndUpdate({ _id: result._id },req.body,{new: true, runValidators: true}, (error, result) =>
          {
            if (!error) 
            {
              req.flash('success', 'Anúncio atualizado com sucesso!');
              return res.redirect('/meusanuncios');
            }
            else
            {
              req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
              return res.redirect('/anuncio/'+result._id+'/edit');
            }
          });
    }
    else
    {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/anuncio/'+result._id+'/edit');
    } 
  });
};
exports.pauseAction = async (req, res) => 
{
  await Ads.findOne({ _id: req.params._id }, async(error, result) => 
  {
    if(`${result.author._id}` == `${req.user._id}`)
    {  
      Ads.findOneAndUpdate({ _id:result._id },{status:"Pausado"}, async(error, result) =>
      {
        if (error) throw error;
          req.flash('success', 'Anúncio pausado com sucesso!');
          return res.redirect('/meusanuncios');
        }); 
    }
    else
    {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/meusanuncios');
    }
  });
};
exports.startingAction = async (req, res) => 
{  
  await Ads.findOne({ _id: req.params._id }, async(error, result) => 
  {
    if(`${result.author._id}` == `${req.user._id}`)
    {  
      Ads.findOneAndUpdate({ _id:result._id },{status:"Publicado"}, async(error, result) =>
      {
        if (error) throw error;
        req.flash('success', 'Anúncio despausado com sucesso!');
        return res.redirect('/meusanuncios');
      }); 
    }
    else
    {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/meusanuncios');
    }
  });
};
exports.ads = async(req, res)=>
{
  let responseJson = 
  {
      ads:[] 
  }; 
  const adsPromise =  Ads.find();
  const [ads] = await Promise.all([adsPromise]);
  for(let i in ads)
  { 
    
    if( ads[i].createdAt){
    
      ads[i].created = moment(ads[i].createdAt).format('DD/MM/YYYY');
    }
    if(ads[i].status == 'Publicado')
    {
     
      ads[i].classNone = "d-inline";
      ads[i].classColor = "badge-success";
      ads[i].class = "d-none";
    }
    else if(ads[i].status == 'Pausado')
    { 
    
      ads[i].classColor = "badge-danger";
      ads[i].class = "d-inline";
      ads[i].classNone = "d-none";
    }
  }


  responseJson.ads = ads;
  res.render('adsAdmin', responseJson);
};
exports.myads = async(req, res)=>
{
  let responseJson = 
  {
      ads:[]  
    
  };  
  const adsPromise =  Ads.find({"author._id": { $in: [req.user._id]}});
  const [ads] = await Promise.all([adsPromise]);
  for(let i in ads)
  { 
    if( ads[i].createdAt){
    
      ads[i].created = moment(ads[i].createdAt).format('DD/MM/YYYY');
    }

    if(ads[i].status == 'Publicado')
    {
      ads[i].classNone = "d-inline";
      ads[i].classColor = "badge-success";
      ads[i].class = "d-none";
    }
    else if(ads[i].status == 'Pausado')
    {
      ads[i].classColor = "badge-danger";
      ads[i].class = "d-inline";
      ads[i].classNone = "d-none";
    }
}
  responseJson.ads = ads;
  res.render('myads', responseJson);
};
exports.filtermyadsdates = async(req, res)=> 
{
  let responseJson = 
  {
      ads:[] 
  }; 

  if(req.body.startDate != '' && req.body.finalDate != '' && req.body.status != '')
  {
    var start = new Date(req.body.startDate);
    var final = new Date(req.body.finalDate);
    var status = req.body.status;
    var startDate = moment(start).format('YYYY/MM/DD');
    var finalDate = moment(final).format('YYYY/MM/DD');

    var adFilter = (startDate != 'Invalid Date' && finalDate != 'Invalid Date' && req.body.status != 'undefined') ? {"createdAt": {"$gt": new Date(startDate),"$lte":new Date(finalDate)},"status":status,"author._id": { $in: [req.user._id]}}:{};
  }
  else if(req.body.startDate != '' && req.body.finalDate != '' && req.body.status == '')
  {
    var start = new Date(req.body.startDate);
    var final = new Date(req.body.finalDate);
    var startDate = moment(start).format('YYYY/MM/DD');
    var finalDate = moment(final).format('YYYY/MM/DD');

    var adFilter = (startDate != 'Invalid Date' && finalDate != 'Invalid Date') ? {"createdAt": {"$gt": new Date(startDate),"$lte":new Date(finalDate)},"author._id": { $in: [req.user._id]}}:{};
  } 
  else if(req.body.status != '')
  {
    var status = req.body.status;
    var adFilter = (req.body.status != 'undefined') ? {"status":status,"author._id": { $in: [req.user._id]}}:{};
  }else
  {
    var adFilter = {"author._id": { $in: [req.user._id]}};
  }
  const adsPromise =  Ads.find(adFilter);
  const [ads] = await Promise.all([adsPromise]);

 
  for(let i in ads)
  { 

    if( ads[i].createdAt){
    
      ads[i].created = moment(ads[i].createdAt).format('DD/MM/YYYY');
    }
  
    if(ads[i].status == 'Publicado')
    {
      
     
      ads[i].classNone = "d-inline";
      ads[i].classColor = "badge-success";
      ads[i].class = "d-none";
    }
    else if(ads[i].status == 'Pausado')
    {
    
      ads[i].classColor = "badge-danger";
      ads[i].class = "d-inline";
      ads[i].classNone = "d-none";
    }
  }

  responseJson.ads = ads;
  res.render('myads', responseJson);
};

exports.filterdates =async(req, res)=> 
{
  let responseJson = 
  {
      ads:[] 
  }; 

  if(req.body.startDate != '' && req.body.finalDate != '' && req.body.status != '')
  {
    var start = new Date(req.body.startDate);
    var final = new Date(req.body.finalDate);
    var status = req.body.status;
    var startDate = moment(start).format('YYYY/MM/DD');
    var finalDate = moment(final).format('YYYY/MM/DD');

    var adFilter = (startDate != 'Invalid Date' && finalDate != 'Invalid Date' && req.body.status != 'undefined') ? {"createdAt": {"$gt": new Date(startDate),"$lte":new Date(finalDate)},"status":status}:{};
  }
  else if(req.body.startDate != '' && req.body.finalDate != '' && req.body.status == '')
  {
    var start = new Date(req.body.startDate);
    var final = new Date(req.body.finalDate);
    var startDate = moment(start).format('YYYY/MM/DD');
    var finalDate = moment(final).format('YYYY/MM/DD');

    var adFilter = (startDate != 'Invalid Date' && finalDate != 'Invalid Date') ? {"createdAt": {"$gt": new Date(startDate),"$lte":new Date(finalDate)}}:{};
  } 
  else if(req.body.status != '')
  {
    var status = req.body.status;
    var adFilter = (req.body.status != 'undefined') ? {"status":status}:{};
  }else
  {
  
    var adFilter = {};
  }

 

  
 
  const adsPromise =  Ads.find(adFilter);
  const [ads] = await Promise.all([adsPromise]);

 
  for(let i in ads)
  { 

    if( ads[i].createdAt){
    
      ads[i].created = moment(ads[i].createdAt).format('DD/MM/YYYY');
    }
  
    if(ads[i].status == 'Publicado')
    {
      
     
      ads[i].classNone = "d-inline";
      ads[i].classColor = "badge-success";
      ads[i].class = "d-none";
    }
    else if(ads[i].status == 'Pausado')
    {
    
      ads[i].classColor = "badge-danger";
      ads[i].class = "d-inline";
      ads[i].classNone = "d-none";
    }
  }

  responseJson.ads = ads;
  res.render('adsAdmin', responseJson);
};