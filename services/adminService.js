const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.imgur_id;

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

  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" });
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error: ', err);
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then(() => {
          callback({
            status: 'success',
            message: 'restaurant was successfully created'
          });
        });
      });
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        CategoryId: req.body.categoryId
      }).then(() => {
        callback({
          status: 'success',
          message: 'restaurant was successfully created'
        });
      });
    }
  },

  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" });
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then(restaurant => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then(() => {
              callback({
                status: 'success',
                message: 'restaurant was successfully update to date'
              });
            });
        });
      });
    } else {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            CategoryId: req.body.categoryId
          })
          .then(() => {
            callback({
              status: 'success',
              message: 'restaurant was successfully update to date'
            });
          });
      });
    }
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy().then(() => {
          callback({ status: 'success', message: 'Delete Success' });
        });
      })
      .catch(err => {
        callback({ status: 'error', message: err.message });
      });
  }
};

module.exports = adminService;
