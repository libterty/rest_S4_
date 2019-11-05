const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const commentController = require('../controllers/commentController.js');

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

  app.get('/', authenticated, (req, res) => res.redirect('restaurants'));
  app.get('/restaurants', authenticated, restController.getRestaurants);
  app.get('/restaurants/feeds', authenticated, restController.getFeeds);
  app.get('/restaurants/:id', authenticated, restController.getRestaurant);
  app.get(
    '/restaurants/:id/dashboard',
    authenticated,
    restController.getDashboard
  );
  app.get('/users/top', authenticated, userController.getTopUser);
  app.get('/users/:id', authenticated, userController.getUser);
  app.get('/users/:id/edit', authenticated, userController.editUser);
  app.get('/signup', userController.signUpPage);
  app.get('/signin', userController.signInPage);
  app.get('/logout', userController.logout);
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  );
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers);
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
  app.get(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.getCategories
  );
  app.get(
    '/admin/categories/:id',
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
  app.post(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.postCategory
  );
  app.post('/comments', authenticated, commentController.postComment);
  app.post(
    '/favorite/:restaurantId',
    authenticated,
    userController.addFavorite
  );
  app.post('/like/:restaurantId', authenticated, userController.addLike);

  app.put(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    upload.single('image'),
    adminController.putRestaurant
  );
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUser);
  app.put(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.putCategory
  );
  app.put(
    '/users/:id',
    authenticated,
    upload.single('image'),
    userController.putUser
  );

  app.delete(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.deleteRestaurant
  );
  app.delete(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.deleteCategory
  );
  app.delete(
    '/comments/:id',
    authenticatedAdmin,
    commentController.deleteComment
  );
  app.delete(
    '/favorite/:restaurantId',
    authenticated,
    userController.removeFavorite
  );
  app.delete('/like/:restaurantId', authenticated, userController.removeLike);
};
