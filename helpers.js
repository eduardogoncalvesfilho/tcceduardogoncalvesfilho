exports.defaultPageTitle = "Imóveis";
exports.menu = [
    {name: 'Entrar', slug:'/users/login', guest:true, logged:false},
];

exports.menuUser = [
    {name: 'Alterar Dados', slug:'/perfil', guest:false, logged:true},
    {name: 'Sair', slug:'/users/logout', guest:false, logged:true}
];

exports.menuAd = [
    {name: 'Anunciar', slug:'/anunciar', guest:true, logged:false}
];

exports.menuMyAd = [
    {name: 'Meus Anúncios', slug:'/meusanuncios', guest:false, logged:true}
];

exports.menuAdmin = [
    {name: 'Dashboard', slug:'/dashboard', guest:false, logged:true},
    {name: 'Categorias', slug:'/adminCategorias', guest:false, logged:true},
    {name: 'Tipos', slug:'/adminTipo', guest:false, logged:true},
    {name: 'Usuários', slug:'/usuarios', guest:false, logged:true},
    {name: 'Anúncios', slug:'/anuncios', guest:false, logged:true}
];

