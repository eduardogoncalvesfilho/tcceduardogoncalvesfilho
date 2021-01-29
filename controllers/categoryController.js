const mongoose = require('mongoose');
const { post } = require('../app');
const Categorys = mongoose.model('Categorys');

exports.categorys = async(req, res)=>
{
  let responseJson = 
  {
     category:[] 
  };
  const categoryPromise =  Categorys.find();
  const [category] = await Promise.all([categoryPromise]);
  responseJson.category = category;
  for(let i in category)
  {
    if(category[i].status == 'Ativo')
    {
      category[i].classNone = "d-inline";
      category[i].classColor = "badge-success";
      category[i].class = "d-none";
    }
    else if(category[i].status == 'Desativado')
    {
      category[i].classColor = "badge-danger";
      category[i].class = "d-inline";
      category[i].classNone = "d-none";
    }
    if(category[i].type == 'Residencial')
    {
      category[i].classTypeNone = "d-inline";
      category[i].classTypeColor = "badge-secondary";
      category[i].classType = "d-none";
    }
    else if(category[i].type == 'Comercial')
    {
      category[i].classTypeColor = "badge-info";
      category[i].classType = "d-inline";
      category[i].classNone = "d-none";
    }    
  }
  res.render('adminCategorys', responseJson);
};
exports.categorysjax = async(req, res)=>
{
  let responseJson = 
  {
    category:[]
  };
  const adFilter = (typeof responseJson.category != 'undefined') ? {status: 'Ativo'}:{};
  const categoryPromise =  Categorys.find(adFilter);
  const [category] = await Promise.all([categoryPromise]);
  responseJson.category = category;
  res.json({responseJson});
};
exports.categorysresidentialajax = async(req, res)=>
{
  let responseJson = 
  {
    category:[],
    type:[]
  };
  responseJson.type = 'Residencial';
  const adFilter = (typeof responseJson.category != 'undefined') ? {status: 'Ativo',type:responseJson.type}:{};
  const categoryPromise =  Categorys.find(adFilter);
  const [category] = await Promise.all([categoryPromise]);
  responseJson.category = category;
  res.json({responseJson});
};
exports.categoryscommercialajax = async(req, res)=>
{
  let responseJson = 
  {
    category:[],
    type:[]
  };
  responseJson.type = 'Comercial';
  const adFilter = (typeof responseJson.category != 'undefined') ? {status: 'Ativo',type:responseJson.type}:{};
  const categoryPromise =  Categorys.find(adFilter);
  const [category] = await Promise.all([categoryPromise]);
  responseJson.category = category;
  res.json({responseJson});
};
exports.add = (req, res) => 
{
  res.render('adminCategoryAdd');
};
exports.addAction = async (req, res) => 
{
  const categorys = new Categorys
  ({
    type:req.body.type, // Tipo da categoria comercial ou residencial.
    name:req.body.category, // Tipo do imovél ex: apartamento, casa
    status:req.body.status
  });
  try 
  {
     await categorys.save();
  } 
  catch (error) 
  {
    req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
    return res.redirect('/categorys');
  }
  req.flash('success', 'Categoria cadastrada com sucesso!');
  res.redirect('/adminCategorias');
};
exports.edit = async (req, res) => 
{
  await Categorys.findOne({ _id: req.params._id }, async(error, result) => 
  {
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
    if(`${result.status}`  == 'Desativado')
    {
      result.classactiveStatusOn = "";
      result.classactiveStatusOff = "active";
      result.classcheckedStatusOn = "checked";
      result.classcheckedStatusOff = "";
    }
    else if(`${result.status}` == 'Ativo')
    {
      result.classactiveStatusOn = "active";
      result.classactiveStatusOff = "";
      result.classcheckedStatusOff = "checked";
      result.classcheckedStatusOn = "";
    }
    res.render('adminCategoryEdit', { category: result });
  });
};
exports.editAction = async (req, res) => 
{
  try 
  {
    const categorys = await Categorys.findOneAndUpdate
    (
      {
        _id: req.params._id 
      },
        req.body,
      {
        new: true, // Retornar Novo item atualizado
        runValidators: true // Validar os dados
      }
    );
  } 
  catch (error) 
  {
    req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
    return res.redirect('/adminCategorias/'+req.params._id+'/edit');
  }
  req.flash('success', 'Categoria atualizada com sucesso!');
  res.redirect('/adminCategorias');
};
exports.delete = async (req, res) => 
{
  await Categorys.deleteOne({_id: req.params._id}, (error, result) =>
  {
    if (!error) 
    {
      req.flash('success', 'Categoria deletada com sucesso!');
      return res.redirect('/adminCategorias');
    }
    else
    {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/adminCategorias');
    }
  });   
};