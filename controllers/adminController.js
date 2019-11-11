/* eslint-disable no-unused-vars */
const fs = require('fs');
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = process.env.imgur_id;

const db = require('../models');
const adminService = require('../services/adminService.js');

const Restaurant = db.Restaurant;
const User = db.User;
const Category = db.Category;

const adminController = {
  getUsers: (req, res) => {
    return User.findAll().then(users => {
      return res.render('admin/users', { users });
    });
  },

  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render('admin/restaurants', data);
    });
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data);
    });
  },

  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', { categories });
    });
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
        return res.redirect('back');
      }
      req.flash('success_messages', data['message']);
      res.redirect('/admin/restaurants');
    });
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', { restaurant, categories });
      });
    });
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
        return res.redirect('back');
      }
      req.flash('success_messages', data['message']);
      res.redirect('/admin/restaurants');
    });
  },

  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user.update({ isAdmin: !user.dataValues.isAdmin }).then(() => {
        req.flash('success_messages', 'user is up to update');
        res.redirect('/admin/users');
      });
    });
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants');
      }
    });
  }
};

module.exports = adminController;
