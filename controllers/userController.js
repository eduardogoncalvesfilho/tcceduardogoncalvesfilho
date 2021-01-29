const User = require( '../models/User' );
const crypto = require( 'crypto' );
const passport = require('passport');
const mailHandler = require( '../handlers/mailHandler');
const { use } = require('../app');


exports.login = ( req, res ) =>
{
    res.render( 'login' );
    
};
exports.loginGoogle = passport.authenticate('google',{scope:['profile','email']});
exports.googleAction = passport.authenticate('google',{successRedirect:'/meusanuncios'});
exports.loginFacebook = passport.authenticate('facebook',{ scope: ['email']});
exports.facebookAction = passport.authenticate('facebook',{successRedirect:'/meusanuncios'});
exports.currentUser = ( req, res ) =>
{
    res.send(req.User);
};
exports.loginAction = (req, res ) =>
{
    const auth = User.authenticate();
    auth( req.body.email, req.body.password, ( error, result ) => 
    {
       if(!result)
       {
            req.flash( 'error', 'Seu e-mail e/ou senha estão errados!' );   
            res.redirect( '/users/login' ); 
            return;
       } 
        req.login( result, ()=>{});
        if(result.eAdmin == 1)
        {
            req.flash( 'success', 'Seja bem-vindo(a) Admin!' );
            res.redirect( '/dashboard' ); 
        }
        else
        {
            res.redirect( '/meusanuncios' ); 
        }
    });
};
exports.register = ( req, res ) =>
{
    res.render( 'register' );  
};
exports.registerAction = ( req, res ) =>
{   
   

    
    req.body.eAdmin = 0;
    req.body.status = 'Ativo';
    req.body.zipCode = '';
    const newUser = new User( req.body );
    User.register( newUser, req.body.password, ( error ) =>
    {
        if(error)
        {
            req.flash( 'error', 'Ocorreu um erro, tente mais tarde!' );
            res.redirect( '/users/register' ); 
            return;
        }
        req.flash( 'success', 'Registro efetuado com sucesso. Faça o Login.' );
        res.redirect( '/users/login' ); 
    });
    
};
exports.addAddress = async ( req, res ) => 
{   
    try 
    {
        const user = await User.findByIdAndUpdate 
        (
            {
                _id:req.user._id
            },
            {
                zipCode:req.body.zipCode, 
                street:req.body.street,
                number:req.body.number, 
                neighb:req.body.neighb,
                city:req.body.city, 
                state:req.body.state,
                complement:req.body.complement, 
                referencePoint:req.body.referencePoint
            },
            {
                new:true, runValidators:true
            }
        );
    }
    catch(e)
    {
        req.flash( 'error', 'Ocorreu um erro, tente mais tarde!' );
        res.redirect( '/perfil' );
        return;
    }
    req.flash( 'success', 'Endereço atualizado com sucesso!' );
    res.redirect( '/perfil' );
};
exports.logout = ( req,res ) =>
{
   req.logout();
   res.redirect( '/' ); 
};
exports.profile = ( req, res ) =>
{
    res.render('profile');
};
exports.profileAction = async ( req, res ) => 
{   
    try 
    {
        const user = await User.findByIdAndUpdate 
        (
            {
                _id:req.user._id
            },
            {
                name:req.body.name, email:req.body.email,phone:req.body.phone
            },
            {
                new:true, runValidators:true
            }
        );
    }
    catch(e)
    {
        req.flash( 'error', 'Ocorreu um erro, tente mais tarde!' );
        res.redirect( '/perfil' );
        return;
    }
    req.flash( 'success', 'Dados atualizados com sucesso!' );
    res.redirect( '/perfil' );
};
exports.forget = ( req, res ) => 
{
    res.render('forget');
};
exports.forgetAction = async ( req, res) => 
{
    // Verificar se o usuário existe virificando seu email.
    const user = await User.findOne( { email:req.body.email } ).exec();
    if(!user) 
    {
        req.flash( 'error', 'E-mail não cadastrado.' ); 
        res.redirect( '/users/forget' ); 
        return;  
    } 
    // Gerar um token ( com data de expiração ) e salvar no banco.
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // expira em 1 hora
    await user.save();
    // Gerar link com token para trocar a senha.
    const resetLink = `https://${req.headers.host}/users/reset/${user.resetPasswordToken}`;
    // TODO: ENVIAR O E-MAIL
    // Enviar o link via e-mail para o usuário.
    const to = `${user.username} - <${user.email}>`;
    const html = `<!DOCTYPE html>
    <html lang="pt-br">
        <head>
            <meta charset="utf-8" />
        </head>
        <body>
            <p><img src="https://imoveis-project.herokuapp.com/assets/images/logo.png" width="184" height="50" border="0" valign="middle></p>
            <p align="justify">
                <center><h2>Recuperar Senha</h2></center>
                <br/>
                Olá, ${user.username}<br><br>
                Você solicitou uma alteração de senha em Imóveis </br><br>
                Para continuar o processo de recuperação de sua senha, clique no link abaixo ou cole o endereço abaixo no seu navegador.</br></br></br></br>
                <p><center><a href="${resetLink}"><img src="https://imoveis-project.herokuapp.com/assets/images/confirmar.png"></a></center></p>
                <br><br>
                
                <p>Se você não solicitou essa alteração, nenhuma ação é necessária. Sua senha permanecerá a mesma.</p>
                <br/><br/>
                <hr size="0" noshade>

            </p>
        </body>
    </html>`
    const text = `Link para recuperar sua senha:${resetLink}`;
    mailHandler.send(
        {
            to,
            subject:'Resetar sua senha',
            html,
            text
        }
    );
    req.flash( 'success', 'Te enviamos um e-mail com instruções.');
    res.redirect( '/users/forget')
    // Usuário vai acessar o link e trocar a senha.
};
exports.forgetToken = async (req, res) => 
{
    const user = await User.findOne
    (
        {
            resetPasswordToken: req.params.token,
            // $gt verifica maior que no banco
            resetPasswordExpires: { $gt: Date.now() }
        }
    ).exec();

    if(!user) 
    {
        req.flash( 'error', 'Token expirado!' );
        res.redirect( '/users/forget' );
        return;
    }

    res.render( 'forgetPassword' );
};
exports.forgetTokenAction =  async ( req, res ) => 
{
    const user = await User.findOne
    (
        {
            resetPasswordToken: req.params.token,
            // $gt verifica maior que no banco
            resetPasswordExpires: { $gt: Date.now() }
        }
    ).exec();

    if(!user) 
    {
        req.flash( 'error', 'Token expirado!' );
        res.redirect( '/users/forget' );
        return;
    }

    if( req.body.password != req.body['password-confirm'] )
    {
        req.flash( 'error', 'Senhas não batem!' );
        res.redirect( 'back' );
        return;
    }
    // 2. Procurar usúario e troca a senha dele.
    user.setPassword( req.body.password, async () => 
    {
        await user.save();
        req.flash( 'success', 'Senha alterada com sucesso!' );
        res.redirect( '/users/login' );
    });
};
exports.usersList =  async ( req, res ) => 
{
    let responseJson = {
        users:[]     
    };
    responseJson.eAdmin = 0;
    const adFilter = (typeof responseJson.users != 'undefined') ? {eAdmin:responseJson.eAdmin}:{};
    const usersPromise =  User.find(adFilter);  
    const [users] = await Promise.all([usersPromise]);   
    responseJson.users = users;
    for(let i in users){
        if(users[i].status == 'Ativo'){
            users[i].classNone = "d-inline";
            users[i].classColor = "badge-success";
            users[i].class = "d-none";
        }else if(users[i].status == 'Desativado'){
            users[i].classColor = "badge-danger";
            users[i].class = "d-inline";
            users[i].classNone = "d-none";
        }
    }
    res.render('users', responseJson);
};
exports.deactivateAction = async (req, res) => 
{  
    await User.findOne({ eAdmin: 1 }, async(error, result) => 
    {
        if(`${result.eAdmin}` == `${req.user.eAdmin}`){  
            User.findOneAndUpdate({ _id:req.params._id },{status:"Desativado"}, async(error, result) =>
            {
                if (error) throw error;
                req.flash('success', 'Usuário desativado com sucesso!');
                return res.redirect('/usuarios');
            }); 
        }
        else
        {
            req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
            return res.redirect('/usuarios');
        }
   });
};
exports.activateAction = async (req, res) => 
{
  await User.findOne({ eAdmin: 1 }, async(error, result) => 
    {
        if(`${result.eAdmin}` == `${req.user.eAdmin}`)
        {  

            User.findOneAndUpdate({ _id:req.params._id  },{status:"Ativo"}, async(error, result) =>
            {
                if (error) throw error;
                req.flash('success', 'Usuário ativado com sucesso!');
                return res.redirect('/usuarios');
            }); 
        }
        else
        {
            req.flash('error', 'Ocorreu um erro, tente novamente mais tarde!');
            return res.redirect('/usuarios');
        }
    });
};
