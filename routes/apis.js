const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const passport = require('../config/passport');
const adminController = require('../controllers/api/adminController.js');
const categoryController = require('../controllers/api/categoryController.js');
const userController = require('../controllers/api/userController.js');
const commentController = require('../controllers/api/commentController');
const restController = require('../controllers/api/restController');
const authenticated = passport.authenticate('jwt', { session: false });
const BlackList = require('../redis');
const blackList = new BlackList();

const authenticatedUser = (req, res, next) => {
  if (req.user) {
    blackList.client.lrange('test1', 0, -1, (err, data) => {
      const token = req.headers.authorization.replace(/Bearer /gi, '');
      if (data.indexOf(token) !== -1) {
        return res.json({ status: 'error', message: 'permission denied' });
      } else {
        if (req.user.id == req.params.id) {
          return next();
        }
        return res.json({ status: 'error', message: 'permission denied' });
      }
    });
  } else {
    return res.json({ status: 'error', message: 'permission denied' });
  }
};

const authenticatedAdmin = (req, res, next) => {
  console.log('req.cookies', req.headers.authorization);
  if (req.user) {
    blackList.client.lrange('test1', 0, -1, (err, data) => {
      const token = req.headers.authorization.replace(/Bearer /gi, '');
      if (data.indexOf(token) !== -1) {
        return res.json({ status: 'error', message: 'permission denied' });
      } else {
        if (req.user.isAdmin) {
          return next();
        }
        return res.json({ status: 'error', message: 'permission denied' });
      }
    });
  } else {
    return res.json({ status: 'error', message: 'permission denied' });
  }
};

router.get(
  '/comments',
  authenticated,
  authenticatedAdmin,
  commentController.getComments
);
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
router.get(
  '/users/:id',
  authenticated,
  authenticatedUser,
  userController.getUser
);
router.get(
  '/users/:id/edit',
  authenticated,
  authenticatedUser,
  userController.editUser
);
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
);
router.get(
  '/admin/restaurants',
  authenticated,
  authenticatedAdmin,
  adminController.getRestaurants
);
router.get(
  '/admin/restaurants/create',
  authenticated,
  authenticatedAdmin,
  adminController.createRestaurant
);
router.get(
  '/admin/restaurants/:id',
  authenticated,
  authenticatedAdmin,
  adminController.getRestaurant
);
router.get(
  '/admin/restaurants/:id/edit',
  authenticated,
  authenticatedAdmin,
  adminController.editRestaurant
);
router.get(
  '/admin/categories',
  authenticated,
  authenticatedAdmin,
  categoryController.getCategories
);
router.get(
  '/admin/categories/:id',
  authenticated,
  authenticatedAdmin,
  categoryController.getCategories
);

router.post('/signin', userController.signIn);
router.post('/signup', userController.signUp);
router.post('/comments', authenticated, commentController.postComment);
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
);
router.post('/like/:restaurantId', authenticated, userController.addLike);
router.post('/following/:userId', authenticated, userController.addFollowing);
router.post(
  '/admin/restaurants',
  upload.single('image'),
  authenticated,
  authenticatedAdmin,
  adminController.postRestaurant
);
router.post(
  '/admin/categories',
  authenticated,
  authenticatedAdmin,
  categoryController.postCategory
);

router.put(
  '/admin/restaurants/:id',
  upload.single('image'),
  authenticated,
  authenticatedAdmin,
  adminController.putRestaurant
);
router.put(
  '/admin/users/:id',
  authenticated,
  authenticatedAdmin,
  adminController.putUser
);
router.put(
  '/admin/categories/:id',
  authenticated,
  authenticatedAdmin,
  categoryController.putCategory
);
router.put(
  '/users/:id',
  authenticated,
  authenticatedUser,
  upload.single('image'),
  userController.putUser
);

router.delete(
  '/admin/restaurants/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteRestaurant
);
router.delete(
  '/admin/categories/:id',
  authenticated,
  authenticatedAdmin,
  categoryController.deleteCategory
);
router.delete('/comments/:id', authenticated, commentController.deleteComment);
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
