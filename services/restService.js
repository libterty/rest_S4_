const Sequelize = require('sequelize');
const db = require('../models');
const Restaurant = db.Restaurant;
const Category = db.Category;
const Comment = db.Comment;
const User = db.User;
const Favorite = db.Favorite;
const Op = Sequelize.Op;
const pageLimit = 10;

const restService = {
  getRestaurants: (req, res, callback) => {
    let offset = 0;
    let whereQuery = {};
    let categoryId = '';

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }

    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery['CategoryId'] = categoryId;
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(result.count / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(
          r.id
        ),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }));
      Category.findAll().then(categories => {
        callback({
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev,
          next
        });
      });
    });
  }
};

module.exports = restService;
