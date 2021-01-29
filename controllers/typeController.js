const mongoose = require('mongoose');
const Types = mongoose.model('Types');
exports.types = async(req, res)=>
{
  let responseJson = 
  {
    type:[] 
  };
  const typePromise =  Types.find();
  const [type] = await Promise.all([typePromise]);
  responseJson.type = type;
  for(let i in type)
  {
    if(type[i].status == 'Ativo')
    {
      type[i].classNone = "d-inline";
      type[i].classColor = "badge-success";
      type[i].class = "d-none";
    }
    else if(type[i].status == 'Desativado')
    {
      type[i].classColor = "badge-danger";
      type[i].class = "d-inline";
      type[i].classNone = "d-none";
    }
    
  }
  res.render('adminTypes', responseJson);
};

exports.typejax = async(req, res)=>
{
  let responseJson = 
  {
    type:[]
  };
  const adFilter = (typeof responseJson.type != 'undefined') ? {status: 'Ativo'}:{};
  const typePromise =  Types.find(adFilter);
  const [type] = await Promise.all([typePromise]);
  responseJson.type = type;
  res.json({responseJson});
};
exports.add = (req, res) => 
{
  res.render('typeadminAdd');
};
exports.addAction = async (req, res) => 
{
  const types = new Types
  ({

    name:req.body.name,
    status:req.body.status
  });
  try 
  {
     await types.save();
  } 
  catch (error) 
  {
    req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
    /*return res.redirect('/categorys');*/
  }
  req.flash('success', 'Tipo cadastrada com sucesso!');
  res.redirect('/adminTipo');
};

exports.edit = async (req, res) => 
{
  await Types.findOne({ _id: req.params._id }, async(error, result) => 
  {
    
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
    res.render('typeadminEdit', { type: result });
  });
};


exports.editAction = async (req, res) => 
{
  try 
  {
    const types = await Types.findOneAndUpdate
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
    return res.redirect('/adminTipo/'+req.params._id+'/edit');
  }
  req.flash('success', 'Tipo atualizada com sucesso!');
  res.redirect('/adminTipo');
};
exports.delete = async (req, res) => 
{
  await Types.deleteOne({_id: req.params._id}, (error, result) =>
  {
    if (!error) 
    {
      req.flash('success', 'Tipo deletada com sucesso!');
      return res.redirect('/adminTipo');
    }
    else
    {
      req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
      return res.redirect('/adminTipo');
    }
  });   
};