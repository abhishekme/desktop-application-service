var exports = module.exports = {}


 
exports.signup = function(req, res) {
   console.log('signup with passport');
    //res.render('signup');
 
}
 
exports.signin = function(req, res) {
 
    res.render('signin');
 
}
 
 
exports.dashboard = function(req, res) {
 
    res.render('dashboard');
 
}