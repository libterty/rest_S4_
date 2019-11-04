const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/signin');
  };

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect('/');
    }
    res.redirect('/signin');
  };

  // 如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('restaurants'));
  app.get('/restaurants', authenticated, restController.getRestaurants);
  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  );
  app.get(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.getRestaurants
  );
  app.get(
    '/admin/restaurants/create',
    authenticatedAdmin,
    adminController.createRestaurant
  );
  app.get(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.getRestaurant
  );
  app.get(
    '/admin/restaurants/:id/edit',
    authenticatedAdmin,
    adminController.editRestaurant
  );
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers);
  app.get('/signup', userController.signUpPage);
  app.get('/signin', userController.signInPage);
  app.get('/logout', userController.logout);
  app.get(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.getCategories
  );

  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  );
  app.post('/signup', userController.signUp);
  app.post(
    '/admin/restaurants',
    authenticatedAdmin,
    upload.single('image'),
    adminController.postRestaurant
  );

  app.put(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    upload.single('image'),
    adminController.putRestaurant
  );
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUser);

  app.delete(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.deleteRestaurant
  );
};
