const restService = require('../services/restService');

const db = require('../models');
const Sequelize = require('sequelize');
const Restaurant = db.Restaurant;
const Category = db.Category;
const Comment = db.Comment;
const User = db.User;
const Favorite = db.Favorite;
const Op = Sequelize.Op;
const pageLimit = 10;

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.render('restaurants', data);
    });
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(
        req.user.id
      );
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(
        req.user.id
      );
      restaurant.update({
        viewCounts: restaurant.viewCounts ? restaurant.viewCounts + 1 : 1
      });
      return res.render('restaurant', {
        restaurant,
        isFavorited,
        isLiked
      });
    });
  },

  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants,
          comments
        });
      });
    });
  },

  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      if (req.params.id) {
        Comment.findAll().then(comments => {
          let restComment = [];
          comments.map(c => {
            if (c.dataValues.RestaurantId === Number(req.params.id)) {
              restComment.push(c.dataValues);
            }
          });
          Category.findByPk(restaurant.CategoryId).then(cat => {
            return res.render('dashboard', { restaurant, restComment, cat });
          });
        });
      }
    });
  },

  getTopRestaurant: (req, res) => {
    return Favorite.findAll().then(favorite => {
      favorite = favorite.map(fav => ({
        ...fav.dataValues
      }));
      const id = favorite.map(c => c.RestaurantId);
      Restaurant.findAll({
        where: {
          id: {
            [Op.in]: id
          }
        }
      }).then(restlists => {
        const restaurant = restlists
          .map(rest => ({ ...rest.dataValues }))
          .sort((a, b) => b.favCounts - a.favCounts)
          .slice(0, 10);
        // const restaurant = restlists
        //   .sort((a, b) => b.favCounts - a.favCounts)
        //   .slice(0, 10);
        return res.render('topRestaurant', { restaurant });
      });
    });
  }
};
module.exports = restController;
