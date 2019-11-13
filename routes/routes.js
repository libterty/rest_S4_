const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'temp/' });
const passport = require('../config/passport');
const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const commentController = require('../controllers/commentController.js');

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
};

const authenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.id == req.params.id) {
      return next();
    }
    req.flash('error_messages', 'Bad Request!');
    return res.redirect(`/users/${req.user.id}`);
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

router.get('/', authenticated, (req, res) => res.redirect('restaurants'));
router.get('/restaurants', authenticated, restController.getRestaurants);
router.get('/restaurants/feeds', authenticated, restController.getFeeds);
router.get('/restaurants/top', authenticated, restController.getTopRestaurant);
router.get('/restaurants/:id', authenticated, restController.getRestaurant);
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
);
router.get('/users/top', authenticated, userController.getTopUser);
router.get('/users/:id', authenticatedUser, userController.getUser);
router.get('/users/:id/edit', authenticatedUser, userController.editUser);
router.get('/signup', userController.signUpPage);
router.get('/signin', userController.signInPage);
router.get('/logout', userController.logout);
router.get('/admin', authenticatedAdmin, (req, res) =>
  res.redirect('/admin/restaurants')
);
router.get('/admin/users', authenticatedAdmin, adminController.getUsers);
router.get(
  '/admin/restaurants',
  authenticatedAdmin,
  adminController.getRestaurants
);
router.get(
  '/admin/restaurants/create',
  authenticatedAdmin,
  adminController.createRestaurant
);
router.get(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.getRestaurant
);
router.get(
  '/admin/restaurants/:id/edit',
  authenticatedAdmin,
  adminController.editRestaurant
);
router.get(
  '/admin/categories',
  authenticatedAdmin,
  categoryController.getCategories
);
router.get(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.getCategories
);

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
);
router.post('/signup', userController.signUp);
router.post(
  '/admin/restaurants',
  authenticatedAdmin,
  upload.single('image'),
  adminController.postRestaurant
);
router.post(
  '/admin/categories',
  authenticatedAdmin,
  categoryController.postCategory
);
router.post('/comments', authenticated, commentController.postComment);
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
);
router.post('/like/:restaurantId', authenticated, userController.addLike);
router.post('/following/:userId', authenticated, userController.addFollowing);

router.put(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  upload.single('image'),
  adminController.putRestaurant
);
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUser);
router.put(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.putCategory
);
router.put(
  '/users/:id',
  authenticatedUser,
  upload.single('image'),
  userController.putUser
);

router.delete(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.deleteRestaurant
);
router.delete(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.deleteCategory
);
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
);
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
);
router.delete('/like/:restaurantId', authenticated, userController.removeLike);
router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing
);

module.exports = router;
