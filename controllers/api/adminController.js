const adminService = require('../../services/adminService.js');
// const db = require('../../models'); 
// const Restaurant = db.Restaurant;
// const Category = db.Category;

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data);
    });
  }
};
module.exports = adminController;
