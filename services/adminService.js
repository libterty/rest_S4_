const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      callback({ restaurants });
    });
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(
      restaurant => {
        callback({ restaurant });
      }
    );
  },

  getCategories: (req, res, callback) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then(category => {
          callback({ categories, category });
        });
      } else {
        callback({ categories });
      }
    });
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.destroy().then(() => {
        callback({ status: 'success', message: '' });
      });
    });
  }
};

module.exports = adminService;
