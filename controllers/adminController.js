const fs = require('fs');
const db = require('../models');
const Restaurant = db.Restaurant;
const User = db.User;

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants });
    });
  },

  getUsers: (req, res) => {
    return User.findAll().then(users => {
      let rule = '';
      users.isAdmin ? (rule = 'Admin') : (rule = 'users');
      return res.render('admin/users', { users, rule });
    });
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create');
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }

    const { file } = req;
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err);
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null
          }).then(restaurant => {
            req.flash(
              'success_messages',
              'restaurant was successfully created'
            );
            return res.redirect('/admin/restaurants');
          });
        });
      });
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description
      }).then(restaurant => {
        req.flash('success_messages', 'restaurant was successfully created');
        res.redirect('/admin/restaurants');
      });
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      });
    });
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant });
    });
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
    }

    const { file } = req;
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err);
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id).then(restaurant => {
            restaurant
              .update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? `/upload/${file.originalname}` : restaurant.image
              })
              .then(restaurant => {
                req.flash(
                  'success_messages',
                  'restaurant was successfully to update'
                );
                res.redirect('/admin/restaurants');
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
            description: req.body.description
          })
          .then(restaurant => {
            req.flash(
              'success_messages',
              'restaurant was successfully to update'
            );
            res.redirect('/admin/restaurants');
          });
      });
    }
  },

  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      // return console.log(user);
      user.update({ isAdmin: !user.dataValues.isAdmin }).then(() => {
        req.flash('success_messages', 'user is up to update');
        res.redirect('/admin/users');
      });
    });
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant.destroy().then(restaurant => {
        res.redirect('/admin/restaurants');
      });
    });
  }
};

module.exports = adminController;
