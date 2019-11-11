const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const adminController = require('../controllers/api/adminController.js');

router.get('/admin/restaurants', adminController.getRestaurants);
router.get('/admin/restaurants/:id', adminController.getRestaurant);
router.get('/admin/categories', adminController.getCategories);
router.get('/admin/categories/:id', adminController.getCategories);

router.post(
  '/admin/restaurants',
  upload.single('image'),
  adminController.postRestaurant
);

router.put(
  '/admin/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
);

router.delete('/admin/restaurants/:id', adminController.deleteRestaurant);

module.exports = router;
