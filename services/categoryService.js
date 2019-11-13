const db = require('../models');
const Category = db.Category;

const categoryService = {
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

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" });
    } else {
      return Category.create({
        name: req.body.name
      }).then(() => {
        callback({
          status: 'success',
          message: 'Category was successfully created'
        });
      });
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" });
    } else {
      return Category.findByPk(req.params.id).then(category => {
        category.update(req.body).then(() => {
          callback({
            status: 'success',
            message: 'Category was successfully update to date'
          });
        });
      });
    }
  },

  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy().then(() => {
          callback({ status: 'success', message: 'Delete Success' });
        });
      })
      .catch(err => {
        callback({ status: 'error', message: err.message });
      });
  }
};

module.exports = categoryService;
