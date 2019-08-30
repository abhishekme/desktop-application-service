var authController = require('../controller/auth/authController');
var userController = require('../controller/user');
module.exports = function(app, passport) {
 
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
             failureRedirect: '/signup'
        }
     ));
 
     app.route('/user')
     .get(userController.getList)
     .delete(userController.delete)
     //.put(userController.update)        
     .post(userController.validate('create'),userController.create)  
    app.put('/user', userController.validate('update'),userController.update);
 
}