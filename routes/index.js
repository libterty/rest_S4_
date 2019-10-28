const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const passport = require('passport');

module.exports = app => {
    //如果使用者訪問首頁，就導向 /restaurants 的頁面
    app.get('/', (req, res) => res.redirect('/restaurants'));

    //在 /restaurants 底下則交給 restController.getRestaurants 來處理
    app.get('/restaurants', restController.getRestaurants);

    // 連到 /admin 頁面就轉到 /admin/restaurants
    app.get('/admin', (req, res) => res.redirect('/admin/restaurants'));

    // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
    app.get('/admin/restaurants', adminController.getRestaurants);

    app.get('/signin', userController.signInPage);

    app.get('/signup', userController.signUpPage);

    app.get('/logout', userController.logout);

    app.post(
        '/signin',
        passport.authenticate('local', {
            failureRedirect: '/signin',
            failureFlash: true
        }),
        userController.signIn
    );

    app.post('/signup', userController.signUp);
};