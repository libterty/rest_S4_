const adminService = require('../services/adminService.js');

const adminController = {
  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.render('admin/users', data);
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
    adminService.createRestaurant(req, res, data => {
      return res.render('admin/create', data);
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
    adminService.editRestaurant(req, res, data => {
      return res.render('admin/create', data);
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
    adminService.putUser(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
        return res.redirect('back');
      }
      req.flash('success_messages', data['message']);
      res.redirect('/admin/users');
    });
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
        return res.redirect('back');
      }
      req.flash('success_messages', data['message']);
      res.redirect('/admin/restaurants');
    });
  }
};

module.exports = adminController;
