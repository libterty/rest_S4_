const userService = require('../services/userService');

const bcrypt = require('bcryptjs');
const imgur = require('imgur-node-api');
const Sequelize = require('sequelize');
const IMGUR_CLIENT_ID = process.env.imgur_id;
const db = require('../models');
const User = db.User;
const Comment = db.Comment;
const Restaurant = db.Restaurant;
const Favorite = db.Favorite;
const Like = db.Like;
const Followship = db.Followship;
const Op = Sequelize.Op;

const userController = {
  signInPage: (req, res) => {
    return res.render('signin');
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    req.user.dataValues.isAdmin
      ? res.redirect('/admin/restaurants')
      : res.redirect('/restaurants');
  },

  signUpPage: (req, res) => {
    return res.render('signup');
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！');
      return res.redirect('/signup');
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！');
          return res.redirect('/signup');
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(() => {
            req.flash('success_messages', '成功註冊帳號！');
            return res.redirect('/signin');
          });
        }
      });
    }
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.render('users', data);
    });
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.render('topUser', data);
    });
  },

  editUser: (req, res) => {
    userService.editUser(req, res, data => {
      return res.render('create', data);
    });
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
        return res.redirect('back');
      }
      req.flash('success_messages', data['message']);
      res.redirect(`/users/${data['user']}`);
    });
  },

  addFavorite: (req, res) => {
    userService.addFavorite(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message']);
      }
      req.flash('success_messages', data['message']);
      res.redirect('back');
    });
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy().then(() => {
        Restaurant.findByPk(req.params.restaurantId).then(restaurant =>
          restaurant.update({
            favCounts: restaurant.favCounts ? restaurant.favCounts - 1 : 0
          })
        );
        return res.redirect('back');
      });
    });
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back');
    });
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      like.destroy().then(() => {
        return res.redirect('back');
      });
    });
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(() => {
      return res.redirect('back');
    });
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy().then(() => {
        return res.redirect('back');
      });
    });
  }
};

module.exports = userController;
