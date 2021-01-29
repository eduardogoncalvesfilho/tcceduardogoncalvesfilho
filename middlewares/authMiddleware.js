exports.isLogged = ( req, res, next ) =>
{
    if( !req.isAuthenticated() )
    {
        req.flash('error', 'Você não tem permissão para acessar esta página. Faça o login!');
        res.redirect('/users/login');
        return;
    }
    next();
};

exports.isLoggedAdd = ( req, res, next ) =>
{
    if( !req.isAuthenticated() )
    {
        req.flash('error', 'Faça o login ou cadastre-se para fazer um anúncio!');
        res.redirect('/users/login');
        return;
    }
    next();
};

exports.changePassword = ( req, res ) => 
{
    // 1. Confirmar se as senhas batem
    if( req.body.password != req.body['password-confirm'] )
    {
        req.flash( 'error', 'Senhas não batem!' );
        res.redirect( '/perfil' );
        return;
    }
    // 2. Procurar usúario e troca a senha dele.
    req.user.setPassword( req.body.password, async () => 
        {
            await req.user.save();
            req.flash( 'success', 'Senha alterada com sucesso!' );
            res.redirect( '/perfil' );
        } 
    );
    // 3. Redirecionar para a HOME

};


exports.isLoggedAdmin = ( req, res, next ) =>
{   
    if(req.isAuthenticated() && req.user.eAdmin == 1 )
    {
        return  next();
    }

    req.flash('error', 'Ops! Você não tem permissão para acessar esta página. Faça o login como administrador!');
    res.redirect('/users/login');
};
// Obriga o usuário a preencher seus dados pessoais
exports.verification = async(req, res, next)=>
{
    const User = require( '../models/User' );
    if(req.isAuthenticated())
    {
        await User.findOne({ _id:req.user._id}, (error, result)=>{

            if(result.zipCode == '' || result.phone == '')
            {
                req.flash( 'success', 'Por favor! Preencha seus dados.' );
                return res.redirect('/perfil');
            }else if(result.zipCode != '' || result.phone != '')
            {
                return  next();
            }
        });
    }
};